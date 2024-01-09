const configServerOM2M = require("../utils/config_om2m");
const formatDate = require("../utils/format_date");
var parseString = require('xml2js').parseString;
const indexService = require('../services/index');
const { v4: uuidv4 } = require('uuid');

const getSensorData = async (req, res) => {
  let limit = 100;
  // let skip = 1;
  try {
    const { tool, sensor } = req.params;
    const { skip } = req.query;
    let resultListData = [];
    var data = await indexService.findInfo(tool, `${sensor}/DATA`);
    const cntData = data['m2m:cnt'];
    const listData = cntData["m2m:cin"];
    if (listData.length <= 100) {
      let listMapData = listData.map((value, index)=> handleData(value));
      resultListData = listMapData;
    } else {
      let skipAdd = 1;
      // check skip is not empty
      if (skip) {
        // check count current < length data
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
      let start = dataC.length - ((skipAdd > 0 ? skipAdd : skipAdd + 1)*limit);
      let end = dataC.length - ((skipAdd > 0 ? skipAdd - 1: skipAdd)*limit);
      let spliceDataLimit = dataC.slice(start < 0 ? 0: start, end > dataC.length ? dataC.length : end);
      let listMapData = spliceDataLimit.map((value, index)=> handleData(value));
      resultListData = listMapData;
    }

    res.status(200).json(resultListData);
  } catch (error) {
    // res.redirect('/');
    res.status(500).json({ message: error.message });

  }
}

const getSensorTool = async (req, res) => {
  let limit = 10;
  let skipAdd = 1;
  let count = 0;
  try {
    const { tool, sensor } = req.params;
    const { skip } = req.query;
    if (skip && (isNaN(skip) || !Number.isInteger(parseInt(skip)) || skip <= 0)) {
      return res.redirect(`/info/${tool}/${sensor}`);
    }

    var resultData = {};
    var data = await indexService.findInfo(tool, sensor);
    const cntData = data['m2m:cnt'];
    resultData.name = cntData.rn;
    resultData.data = [];
    resultData.description = {};
    resultData.sub =[];

    /// split get id
    const splitRi = cntData.ri.split('/');
    if (splitRi.length > 0) {
      resultData.id = splitRi[splitRi.length - 1];
    } else {
      resultData.id = splitRi[0];
    }

    const containerCnt = cntData["m2m:cnt"];
    if (containerCnt && Array.isArray(containerCnt)) {
      containerCnt.forEach((c, index)=>{
        if (c.rn == 'DATA') {
          const dataC = c['m2m:cin'];
          const dataSub = c['m2m:sub'];
          // m2m:sub => get Subcribe Notify
          if(dataSub && dataSub.length > 0){
            let listDataSub = dataSub.map((value, index)=>{
              let newDataSub = {};
              newDataSub.name = value.rn;
              let splitId = value.ri.split('/');
              newDataSub.id = splitId[splitId.length - 1];
              newDataSub.listUrl = value.nu;
              return newDataSub;
            });
            resultData.sub = listDataSub;
          }
          resultData.data = [];
          if (!dataC || dataC.length == 0) {
            return;
          } else {
            let listData = [];
            count = dataC.length;
            if (dataC.length <= limit) {
              let newData = dataC.map((value, index)=>handleData(value));
              listData = newData;
            } else {
              if (skip) {
                if (skip * limit > dataC.length) {
                  if ((skip - 1) * limit <= dataC.length) {
                    skipAdd = skip;
                  } else {
                    return res.redirect(`/info/${tool}/${sensor}`);
                  }
                } else {
                  if (skip <= 0) skipAdd = 1;
                  skipAdd = skip;
                }
              }
              let start = dataC.length - ((skipAdd > 0 ? skipAdd : skipAdd + 1)*limit);
              let end = dataC.length - ((skipAdd > 0 ? skipAdd - 1: skipAdd)*limit);
              let spliceDataLimit = dataC.slice(start < 0 ? 0: start, end > dataC.length ? dataC.length : end);
              let listMapData = spliceDataLimit.map((value, index)=> handleData(value));
              listData = listMapData;
            }
            resultData.data = listData;
          }
        } else {
          const dataC = c['m2m:cin'];
          if (!dataC || dataC.length == 0) {
            resultData.description = {};
          } else {
            let newData = handleData(dataC[0]);
            resultData.description = newData;
          }
        }
      });
    }
    res.render('dashboard/manage_info_sensor', { title: tool, sensor, data: resultData, skip: skipAdd, count, countPaginate: Math.ceil(count / limit),limit });
  } catch (error) {
    res.redirect('/');
  }
}

function handleData(cin) {
  const newContentDataObject = {};
  newContentDataObject.id = cin.rn.replace('_','-');
  newContentDataObject.ct = cin.ct;
  const intnameArray= cin.con.split('"');
  for (let index = 1; index < intnameArray.length; index+=4) {
    const keyname = intnameArray[index];
    newContentDataObject[keyname] = intnameArray[index+2];
  }
  newContentDataObject.createdAt = formatDate.formatDate(cin.ct);
  return newContentDataObject;
}

const getInfoTool = async (req, res) => {
  try {
    const { tool } = req.params;
    var listTitleSensor = [];
    var data = await indexService.findInfo(tool, '', 'ty=3&fu=1');
    if (!data || data.length === 0) {
      console.log('No Data');
    } else {
      var uril = data['m2m:uril'];
      if (!uril) {
      } else {
        uril.forEach((s, i)=>{
          const splitUri = s.split('/');
          if (tool != splitUri[3]) return;
          let newData = {
            name: splitUri[4],
            data: splitUri[5] ? [splitUri[5]] : [],
          }

          let index = listTitleSensor.findIndex((element)=> element.name === splitUri[4]);

          if (index != -1) {
            listTitleSensor[index].data.push(splitUri[5]);
          } else {
            listTitleSensor.push(newData);
          }
        });
      }
    }
    res.render('dashboard/manage_info_tool.ejs', { title: tool, data: listTitleSensor });
  } catch (error) {
    res.redirect('/');
  }
}


const getDataTool = async (req, res) => {
  try {
    var listName = [];
    var data = await indexService.getDataMN();
    const listAe = data["m2m:uril"];
    let mapData = listAe.map((value, index)=>{
      let newData = {};
      const splitRi = value.split('/');
      newData.name = splitRi[splitRi.length - 1];
      listName.push(newData);
      return newData;
    });
    res.render('dashboard/index', { data: mapData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJsonApplication = async (req, res) => {
  try {
    var data = await indexService.getDataMN();
    const listAe = data["m2m:uril"];
    let mapData = listAe.map((value, index)=>{
      const splitRi = value.split('/');
      const name = splitRi[splitRi.length - 1];
      return name;
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
    var data = await indexService.findInfo(tool, '', 'ty=3&fu=1');
    if (!data || data.length === 0) {
      console.log('No Data');
    } else {
      var uril = data['m2m:uril'];
      if (!uril) {
      } else {
        uril.forEach((s, i)=>{
          const splitUri = s.split('/');
          if (tool != splitUri[3]) return;
          let newData = {
            name: splitUri[4],
            data: splitUri[5] ? [splitUri[5]] : [],
          }

          let index = listTitleSensor.findIndex((element)=> element.name === splitUri[4]);

          if (index != -1) {
            listTitleSensor[index].data.push(splitUri[5]);
          } else {
            listTitleSensor.push(newData);
          }
        });
      }
    }
    res.status(200).json({data: listTitleSensor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create tool ty = 2
const postCreateTool = async (req, res) => {
  try {
    const { name, label } = req.body;
    if(!name || !label) throw new Error('name sensor and label must be provided');
    const randomId = uuidv4();
    const xmlBody = `
        <m2m:ae xmlns:m2m="http://www.onem2m.org/xml/protocols" rn="${name}" >
          <api>${randomId}</api>
          <lbl>${label}</lbl>
          <rr>false</rr>
      </m2m:ae>
    `;
    const headers = {
      ...configServerOM2M.infoHost.headers,
      'Content-Type': 'application/xml;ty=2',
    };
    const url = configServerOM2M.urlHost();
    const xmlTextResult = await indexService.create(url, xmlBody, headers);
    let data = {};
    await parseString(xmlTextResult, function (err, result) {
      data = result;
      if(err) throw err;
    });
    if (!data) throw new Error('Error !!!');
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error.message);
    res.redirect(`?error=${error.message}`);
  }
}

/// create sensor in tool ty=3
const postCreateSensor = async (req, res) => {
  const arrBody = ['DESCRIPTOR','DATA'];
  try {
    const { name } = req.body;
    const { tool } = req.params;
    if(!name) throw new Error('Name required');
    const xmlBody = `<m2m:cnt xmlns:m2m="http://www.onem2m.org/xml/protocols" rn="${name}"></m2m:cnt>`;
    const headers = {
      ...configServerOM2M.infoHost.headers,
      'Content-Type': 'application/xml;ty=3',
    };
    const url = `${configServerOM2M.urlHost()}/${tool}`;
    const xmlTextResult = await indexService.create(url, xmlBody, headers);
    let data = {};
    await parseString(xmlTextResult, function (err, result) {
      data = result;
    });
    if (!data){
      throw new Error('Đã xảy ra lỗi!!!');
    }else{
      arrBody.forEach((value)=>{
        const result = createDescriptionAndData(value, tool, name);
        if(!result) throw new Error('Đã xảy ra lỗi!!!');
      });
    };
    res.redirect(`/info/${tool}`);
  } catch (error) {
    res.redirect(`?error=${error}`);
  }
}


///Funtion create descriptor and data in sensor
async function createDescriptionAndData(nameData, tool, sensor){
  const xmlBody = `<m2m:cnt xmlns:m2m="http://www.onem2m.org/xml/protocols" rn="${nameData}"></m2m:cnt>`;
    const headers = {
      ...configServerOM2M.infoHost.headers,
      'Content-Type': 'application/xml;ty=3',
    };

    const url = `${configServerOM2M.urlHost()}/${tool}/${sensor}`;
    const dataText = await indexService.create(url, xmlBody, headers);
    return dataText;
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
    res.redirect('/');
    // res.status(200).json({ data: data });
  } catch (error) {
    res.redirect('?error=');
  }
}

/// create container data and descriptor in sensor ty=3
const postCreateDataSubcribe= async (req, res) => {
  try {
    const { urlAPI, name } = req.body;
    const { tool, sensor} = req.params;
    
    const bodyAddUrl = () =>{
      if(urlAPI && Array.isArray(urlAPI)){
        return urlAPI.map((value, index)=>`<nu>${value}</nu>`).join('');
      }else{
        return `<nu>${urlAPI}</nu>`;
      }
    }

    const xmlBody =  `
      <m2m:sub xmlns:m2m="http://www.onem2m.org/xml/protocols" rn="${name}">
          ${bodyAddUrl()}
          <nct>2</nct>
      </m2m:sub>`
    const headers = {
      ...configServerOM2M.infoHost.headers,
      'Content-Type': 'application/xml;ty=23',
    };

    const url = `${configServerOM2M.urlHost()}/${tool}/${sensor}/DATA`;
    const dataText = await indexService.create(url, xmlBody, headers);
    let data = {};
    await parseString(dataText, function (err, result) {
      if(err) throw err;
      data = result;
    });
    // res.status(200).json({ data: data });
    res.redirect('/');
  } catch (error) {
    console.log('error: ' + error.message);
    res.redirect('?error=');
  }
}

const deleteById = async (req, res) => {
  try {
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
    const {tool, sensor} = req.query;
    if(!tool){
      throw new Error('Tool not empty!!!');
    }
    const uri = `${tool ? '/'+tool: ''}${sensor ? '/'+sensor: ''}` ;
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

const getCreatePage = async (req, res) => {
  res.render('dashboard/create_page');
}

const postCreate = async (req, res) => {
  console.log('test 123456');
  const {method} = req.body;
  console.log('method',method);
  switch (method) {
    case '1': {
      console.log(req.body);
      return postCreateTool(req, res);
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
  postCreateTool,
  postCreateSensor,
  postCreateContainerInSensor,
  deleteById,
  getCreateTool,
  getCreateSensorTool,
  deleteQuery,
  getCreateDataSubcribe,
  postCreateDataSubcribe,
  getCreatePage,
  postCreate,
  getJsonApplication,
  getJsonSensor,
};
