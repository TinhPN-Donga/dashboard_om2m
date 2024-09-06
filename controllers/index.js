const configServerOM2M = require("../utils/config_om2m");
const formatDate = require("../utils/format_date");
var parseString = require('xml2js').parseString;
const indexService = require('../services/index');
const { v4: uuidv4 } = require('uuid');
const listDataDescription = ['Data','Description'];

const getCreatePage = async (req, res) => {
  res.render('dashboard/create_page');
}

// API
const getJsonApplication = async (req, res) => {
  try {
    var data = await indexService.findInfo();
    const listAe = data["m2m:cb"]["m2m:ae"];
    let mapData = listAe.map((value, index)=>{
      const splitRi = value.ri.split('/');
      const id = splitRi[splitRi.length - 1];
      const name = value.rn;
      return {name, id};
    });
    res.status(200).json({data: mapData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJsonSensor = async (req, res) => {
  try {
    const { tool } = req.params;
    var listTitleSensor = [];
    let data = await indexService.findById(tool);
    if (!data || data.length === 0) {
    } else {
      let cnt = data['m2m:ae']['m2m:cnt'];
      console.log(cnt);
      if (cnt) {
        listTitleSensor = cnt.map((e, i) => {
          const splitRi = e.ri.split('/');
          return {name: e.rn, id: splitRi[splitRi.length - 1]}
        });
      }
    }
    res.status(200).json({data: listTitleSensor });
  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({ message: error.message });
  }
};


const getSensorData = async (req, res) => {
  let limit = 100;
  // let skip = 1;
  try {
    const { tool, sensor } = req.params;
    const { skip } = req.query;
    let resultListData = [];
    var data = await indexService.findInfo(tool, sensor, 'DATA');
    const cntData = data['m2m:cnt'];
    const listData = cntData["m2m:cin"];
    if (listData.length <= 100) {
      for (let cin of listData) {
        parseString(cin.con, function (err, result) {
          const listInt = result.obj.int;
          const listBool = result.obj.bool;
          const newListInt = [];
          let newContentData = {};
          newContentData.id = cin.rn.split('_').join('-');
          for (let intObj of listInt) {
            newContentData[intObj['$'].name] = intObj['$'].val;
            newListInt.push(intObj['$']);
          }
          if (listBool && listBool.length > 0) {
            newContentData[listBool[0]['$'].name] = listBool[0]['$'].val;
            newListInt.push(listBool[0]['$']);
          }
          newContentData.createdAt = formatDate.formatDate(cin.ct);
          resultListData.push(newContentData);
        });
      }
    } else {
      let skipAdd = 1;
      if (skip) {
        if (skip * limit > listData.length) {
          if ((skip - 1) * limit <= listData.length) {
            skipAdd = skip;
          } else {
            skipAdd = 1;
          }
        } else {
          skipAdd = skip;
        }
      }
      for (let i = (skipAdd - 1) * limit; i <= skipAdd * limit; i++) {
        parseString(listData[i].con, function (err, result) {
          const listInt = result.obj.int;
          const listBool = result.obj.bool;
          const newListInt = [];
          let newContentData = {};
          newContentData.id = listData[i].rn.split('_').join('-');
          for (let intObj of listInt) {
            newContentData[intObj['$'].name] = intObj['$'].val;
            newListInt.push(intObj['$']);
          }
          if (listBool && listBool.length > 0) {
            newContentData[listBool[0]['$'].name] = listBool[0]['$'].val;
            newListInt.push(listBool[0]['$']);
          }
          newContentData.createdAt = formatDate.formatDate(listData[i].ct);
          resultListData.push(newContentData);
        });
      }
    }

    res.json(resultListData);

  } catch (error) {
    res.redirect('/');
    // res.status(500).json({ message: error.message });

  }
}

const getSensorTool = async (req, res) => {
  let limit = 10;
  let skipAdd = 1;
  let count = 0;
  try {
    const { tool, sensor } = req.params;
    const { skip } = req.query;
    console.log(!Number.isInteger(skip));
    if (skip && (isNaN(skip) || !Number.isInteger(parseInt(skip)) || skip <= 0)) {
      return res.redirect(`/info/${tool}/${sensor}`);
    }

    var resultData = {};
    var data = await indexService.findById(sensor);
    const cntData = data['m2m:cnt'];
    resultData.name = cntData.rn;
    resultData.data = [];
    resultData.description = {};

    const splitRi = cntData.ri.split('/');
    if (splitRi.length > 0) {
      resultData.id = splitRi[splitRi.length - 1];
    } else {
      resultData.id = splitRi[0];
    }

    if(data['m2m:cnt']['m2m:cin']){
      const cin = data['m2m:cnt']['m2m:cin'];
      cin.forEach((e, i)=>{
        let newData = {}
        newData.createdAt = formatDate.formatDate(e.ct);
        const idRi = e.ri.split('/');
        newData.id = idRi[idRi.length-1]
        newData.data = e.con
        resultData.data = [...resultData.data, newData]
      })
    }
    res.render('dashboard/manage_info_sensor', { title: tool, sensor, data: resultData, skip: skipAdd, count, countPaginate: Math.ceil(count / limit) });
  } catch (error) {
    res.redirect('/');
  }
}

const getInfoTool = async (req, res) => {
  try {
    const { tool } = req.params;
    let dataTool = {id: tool}
    var listTitleSensor = [];
    var data = await indexService.findInfo(tool, '', 'rcn=4');
    if (!data || data.length === 0) {
    } else {
      dataTool = {...dataTool, title:data['m2m:ae'].rn}
      const dataCNT = data['m2m:ae']['m2m:cnt'];
      if(dataCNT){
        console.log('m2m:cnt ',data['m2m:ae']['m2m:cnt']);
        title = data.rn;
        dataCNT.forEach((e, i)=>{
          const splitRi = e.ri.split('/');
          const addNewData = {
            name: e.rn,
            id: splitRi[splitRi.length - 1]
          }
          listTitleSensor.push(addNewData)
        })
      }
    }
    res.render('dashboard/manage_info_tool.ejs', { dataTool: dataTool, data: listTitleSensor });
  } catch (error) {
    res.redirect('/');
  }
}

const getDataTool = async (req, res, next) => {
  try {
    var listName = [];
    var data = await indexService.findInfo();
    const listAe = data["m2m:cb"]["m2m:ae"];
    for (let e of listAe) {
      let newData = {};
      newData.name = e.rn;
      const splitRi = e.ri.split('/');
      newData.id = splitRi[splitRi.length - 1];
      listName.push(newData);
    }
    res.render('dashboard/index', { data: listName });
  } catch (error) {
    next();
  }
};

// create application ty = 2
const postCreateApplication = async (req, res) => {
  console.log(`req.body`,req.body);
  try {
    const { name, label } = req.body;
    if(!name || !label) throw new Error('name sensor and label must be provided');
    const randomId = uuidv4();

    const body = {
      "m2m:ae":{
          "rn": name,
          "lbl": Array.isArray(label) ? label : [
            label
          ],
          "rr": false,
          "api": randomId
      }
  };
    const headers = {
      ...configServerOM2M.infoHost.headers,
      'Content-Type': 'application/json;ty=2',
    };
    const url = configServerOM2M.urlHost();
    const resultData = await indexService.create(url, JSON.stringify(body), headers);
   console.log('is true', !resultData);
   
    if (!resultData) throw new Error('Error !!!')
    else{
      const idNewData = resultData['m2m:ae'].aei;
      console.log('idNewData',idNewData);
      
      for(let i of listDataDescription){
        await createDescriptionAndData(i, idNewData);
      }
    }
    res.redirect('/dashboard');
  } catch (error) {
    const messageError = 'Create data failed!(Name Application Entity invalid).';
    console.error(messageError);
    console.error(error.message);
    res.redirect('/dashboard');
  }
}

/// create sensor in tool ty=3
const postCreateSensor = async (req, res) => {
  try {
    const { name } = req.body;
    const { tool } = req.params;
    if(!name) throw new Error('Name required');
   
    const body = {
      "m2m:cnt":{
        "rn": name,
        "lbl": [
            "Label-1",
            "Label-2"
        ],
        "mni": 120
      }
    }
    const headers = {
      ...configServerOM2M.infoHost.headers,
      'Content-Type': 'application/json;ty=3',
    };
    const url = `${configServerOM2M.urlHost()}/${tool}`;
    console.log('url',url);
    console.log('body',body);
    console.log('headers',headers);
    
    await indexService.create(url, JSON.stringify(body), headers).then(e=>{
      console.log('result data',e);
    });
    
    res.redirect(`/info/${tool}`);
  } catch (error) {
    res.redirect(`?error=${error.message}`);
  }
}

///Funtion create descriptor and data in sensor
async function createDescriptionAndData(nameData, id){
    const body = {
      "m2m:cnt":{
          "rn": nameData,
          "lbl": [
              "Label-1",
              "Label-2"
          ],
          "mni": 120
      }
  }
    const headers = {
      ...configServerOM2M.infoHost.headers,
      'Content-Type': 'application/json;ty=3',
    };

    const url = `${configServerOM2M.urlHost()}/${id}`;
    console.log('url',url,'- ', nameData);
    
    const dataText = await indexService.create(url, JSON.stringify(body), headers);
    return dataText;
}

///Funtion create descriptor and data in sensor
async function postCreateData(req, res){
  return res.json({data: "123456"});
}

/// create container data and descriptor in sensor ty=3
const postCreateContainerInSensor = async (req, res) => {
  try {
    const { name } = req.body;
    const { tool, sensor } = req.params;
    const xmlBody = `<m2m:cnt xmlns:m2m="http://www.onem2m.org/xml/protocols" rn="${name}">
    </m2m:cnt>`;
    const headers = {
      ...configServerOM2M.infoHost.headers,
      'Content-Type': 'application/xml;ty=3',
    };

    const url = `${configServerOM2M.urlHost()}/${tool}/${sensor}`;
    const dataText = await indexService.create(url, xmlBody, headers);
    let data = {};
    await parseString(dataText, function (err, result) {
      data = result;
    });
    if (!data) throw new Error('Error !!!');
    res.status(200).json({ data: data });
  } catch (error) {
    res.redirect('/');
  }
}

/// create container data and descriptor in sensor ty=3
const postCreateDataSubcribe= async (req, res) => {
  try {
    const { urlAPI, title } = req.body;
    const { tool, sensor} = req.params;
      const body ={
        "m2m:sub": {
            "rn": title,
            "nu": urlAPI,
            "nct": "2"
        }
    }
    const headers = {
      ...configServerOM2M.infoHost.headers,
      'Content-Type': 'application/json;ty=23',
    };

    const url = `${configServerOM2M.urlHost()}/${sensor}`;
    console.log(url);
    
    const dataText = await indexService.create(url, body, headers);
    res.status(200).json({ data: dataText });
  } catch (error) {
    // res.redirect('/');
    console.log('error: ' + error.message);
  }
}

const postCreate = async (req, res) => {
  const {method} = req.body;
  switch (method) {
    case '1': {
      console.log(`req.body`,req.body);
      return postCreateApplication(req, res);
    };
    case '2': {
      const {application, name} = req.body;
      req.params.tool = application;
      return postCreateSensor(req, res);
    };
    case '3': {
      const {application, sensor, title} = req.body;
      req.params.tool = application;
      req.params.sensor = sensor;
      return postCreateContainerInSensor(req, res);
    };
    case '4': {
      console.log(req.body);
      const {application, sensor} = req.body;
      req.params.tool = application;
      req.params.sensor = sensor;
      return postCreateDataSubcribe(req, res);
    }
    default:
      break;
  }
  res.redirect('?');
}

const deleteById = async (req, res) => {
  try {
    console.log('req.originalUrl',req.originalUrl);
    const { id } = req.params;
    let fetchApi = await indexService.deleteById(id);
    if(fetchApi){
      return res.status(200).json({message: 'Successfully deleted', status: 200});
    }else{
      throw new Error('Failed deleted');
    }
  } catch (error) {
    return res.status(500).json({message: 'Failed deleted', status: 500});
  }
}

const deleteQuery = async (req, res) => {
  try {
    const {id} = req.query;
    const uri = `${id ? '/'+id: ''}` ;
    console.log(`uri: ${uri}`);
    let fetchApi = await indexService.deleteQuery(uri);
    if(fetchApi){
      return res.status(200).json({message: 'Successfully deleted', status: 200});
    }else{
      throw new Error('Failed deleted');
    }
  } catch (error) {
    console.log(`error.message ${error.message}`);
    return res.status(500).json({message: 'Failed deleted', status: 500});
  }
}

const getCreateTool = async (req, res) => {
  res.render('dashboard/create_tool');
}

const getCreateDataSubcribe = async (req, res) => {
  res.render('dashboard/create_sensor_data_subcribe');
}
const getCreateSensorTool = async (req, res) => {
  res.render('dashboard/create_sensor_tool');
}


module.exports = {
  getSensorTool,
  getDataTool,
  getInfoTool,
  getSensorData,
  postCreateApplication,
  postCreateSensor,
  postCreateContainerInSensor,
  deleteById,
  getCreateTool,
  getCreateSensorTool,
  deleteQuery,
  getCreateDataSubcribe,
  postCreateDataSubcribe,
  getJsonApplication,
  getJsonSensor,
  getCreatePage,
  postCreate,
  postCreateData
};
