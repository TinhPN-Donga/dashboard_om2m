const { response } = require("express");
const configServerOM2M = require("../utils/config_om2m");
const formatDate = require("../utils/format_date");
var parseString = require('xml2js').parseString;
const indexService = require('../services/index');
const { v4: uuidv4 } = require('uuid');

class DataDHT {
  constructor(temp, humi, createdAt) {
    this.temp = temp;
    this.humi = humi;
    this.createdAt = createdAt;
  }
}

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
    console.log(typeof skip);
    if (skip && (isNaN(skip) || !Number.isInteger(parseInt(skip)) || skip <= 0)) {
      return res.redirect(`/info/${tool}/${sensor}`);
    }

    var resultData = {};
    var data = await indexService.findInfo(tool, sensor);
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

    const containerCnt = cntData["m2m:cnt"];
    if (containerCnt && Array.isArray(containerCnt)) {
      for (c of containerCnt) {
        if (c.rn == 'DATA') {
          const dataC = c['m2m:cin'];
          resultData.data = [];
          if (!dataC || dataC.length == 0) {

          } else {
            const listData = [];
            count = dataC.length;
            dataC.reverse();
            if (dataC.length <= limit) {
              for (let cin of dataC) {
                let newData = handleData(cin);
                listData.push(newData);
              }
            } else {
              let isFinal = false;
              if (skip) {
                if (skip * limit > dataC.length) {
                  if ((skip - 1) * limit <= dataC.length) {
                    isFinal = true;
                    skipAdd = skip;
                  } else {
                    skipAdd = 1;
                  }
                } else {
                  if (skip <= 0) skipAdd = 1;
                  skipAdd = skip;
                }
              }
              for (let i = (skipAdd - 1) * limit; i < skipAdd * limit; i++) {
                if (dataC[i]) {
                  let newData = handleData(dataC[i]);
                  listData.push(newData);
                }
              }
            }
            resultData.data = listData;
          }
        } else {
          const dataC = c['m2m:cin'];
          if (!dataC || dataC.length == 0) {
            resultData.description = {};
          } else {
            parseString(dataC[0].con, function (err, result) {
              resultData.description = {};
              const strResult = result.obj.str;
              for (let d of strResult) {
                resultData.description[d['$'].name] = d['$'].val;
              }
            });
          }

        }
      }
    }
    res.render('dashboard/manage_info_sensor', { title: tool, sensor, data: resultData, skip: skipAdd, count, countPaginate: Math.ceil(count / limit) });
  } catch (error) {
    res.redirect('/');
    // res.status(500).json({ message: error.message });
  }
}

const getInfoDataSensor = async (req, res) => {
  let limit = 100;
  const { tool, sensor, data } = req.params;
  const { skip } = req.query;
  let skipAdd = 1;
  try {
    let resultListData = [];
    var response = await indexService.findInfo(tool, `${sensor}/${data}`);
    const cntData = response['m2m:cnt'];
    const listData = cntData["m2m:cin"];
    if (listData) {
      if (listData.length <= 100) {
        for (let cin of listData) {
          let newData = handleData(cin);
          resultListData.push(newData);
        }
      } else {
        let isFinal = false;
        if (skip) {
          if (skip * limit > listData.length) {
            if ((skip - 1) * limit <= listData.length) {
              isFinal = true;
              skipAdd = skip;
            } else {
              skipAdd = 1;
            }
          } else {
            skipAdd = skip;
          }
        }
        for (let i = (skipAdd - 1) * limit; i <= skipAdd * limit; i++) {
          if (listData[i]) {
            let newData = handleData(listData[i]);
            resultListData.push(newData);
          }
        }
      }
    }
    res.render('info_sensor', { title: tool, sensor, data: resultListData, limit: limit, skip: skipAdd, });
  } catch (error) {
    res.redirect('/');
    // res.status(500).json({ message: error.message });
  }
}

function handleData(cin) {
  let newContentData = {};
  parseString(cin.con, function (err, result) {
    const listInt = result.obj.int ? result.obj.int : [];
    const listBool = result.obj.bool ? result.obj.bool : [];
    const listStr = result.obj.str ? result.obj.str : [];
    const newListInt = [];
    newContentData.id = cin.rn.split('_').join('-');
    for (let intObj of listInt) {
      newContentData[intObj['$'].name] = intObj['$'].val;
      newListInt.push(intObj['$']);
    }
    if (listBool && listBool.length > 0) {
      newContentData[listBool[0]['$'].name] = listBool[0]['$'].val;
      newListInt.push(listBool[0]['$']);
    }
    if (listStr && listStr.length > 0) {
      newContentData[listStr[0]['$'].name] = listStr[0]['$'].val;
      newListInt.push(listStr[0]['$']);
    }
    newContentData.createdAt = formatDate.formatDate(cin.ct);
  });
  return newContentData;
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
        for (var s of uril) {
          const splitUri = s.split('/');
          if (tool != splitUri[3]) continue;
          let newData = {
            name: splitUri[4],
            data: splitUri[5] ? [splitUri[5]] : [],
          }

          let index = -1;
          listTitleSensor.forEach((value, i) => {
            if (value.name === splitUri[4]) {
              index = i;
            }
          });

          if (index != -1) {
            listTitleSensor[index].data.push(splitUri[5]);
          } else {
            listTitleSensor.push(newData);
          }
        }
      }
    }
    res.render('dashboard/manage_info_tool.ejs', { title: tool, data: listTitleSensor });
  } catch (error) {
    res.redirect('/');
    // res.status(500).json({ message: error.message });
  }
}

const getAllData = async (req, res) => {
  try {
    var listDataDHT = [];
    var data = await indexService.getAllData();
    const listData = data["m2m:cnt"]["m2m:cin"];
    for (var i of listData) {
      parseString(i.con, function (err, result) {
        listDataDHT.push(
          new DataDHT(
            result.obj.int[0]["$"].val,
            result.obj.int[1]["$"].val,
            formatDate.formatDate(i.ct)
          )
        );
      });
    }
    res.status(200).json({ listDataDHT });
  } catch (error) {
    res.redirect('/');
    // res.status(500).json({ message: error.message });
  }
};

const getDataTool = async (req, res) => {
  try {
    var listName = [];
    var data = await indexService.getDataMN();
    const listAe = data["m2m:uril"];
    for (let e of listAe) {
      let newData = {};
      const splitRi = e.split('/');
      newData.name = splitRi[splitRi.length - 1];
      listName.push(newData);
    }
    res.render('dashboard/index', { data: listName });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDataOl = async (req, res) => {
  try {
    var listDataDHT = [];
    var data = await indexService.getFirstData();
    const dataCin = data["m2m:cin"];
    parseString(dataCin.con, function (err, result) {
      listDataDHT.push(
        new DataDHT(
          result.obj.int[0]["$"].val,
          result.obj.int[1]["$"].val,
          formatDate.formatDate(dataCin.ct)
        )
      );
    });
    res.status(200).json({ listDataDHT });
  } catch (error) {
    res.redirect('/');
    // res.status(500).json({ message: error.message });
  }
};

const getAllDataLa = async (req, res) => {
  try {
    var listDataDHT = [];
    var data = await indexService.getLastData();
    const dataCin = data["m2m:cin"];
    parseString(dataCin.con, function (err, result) {
      listDataDHT.push(
        new DataDHT(
          result.obj.int[0]["$"].val,
          result.obj.int[1]["$"].val,
          formatDate.formatDate(dataCin.ct)
        )
      );
    });
    res.status(200).json({ listDataDHT });
  } catch (error) {
    res.redirect('/');
    // res.status(500).json({ message: error.message });
  }
};


// create

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
      throw err;
    });
    if (!data) throw new Error('Error !!!');
    res.redirect('dashboard');
  } catch (error) {
    console.log(error.message);
    const messageError = '';
    res.redirect(`?error=${error.message}`);
    // res.status(500).json({ message: error.message });
  }
}

/// create sensor in tool ty=3
const postCreateSensor = async (req, res) => {

  const arrBody = ['Descriptor','Data'];

  try {
    const { name } = req.body;
    const { tool } = req.params;
    if(!name) throw new Error('Name required');
    const xmlBody = `<m2m:cnt xmlns:m2m="http://www.onem2m.org/xml/protocols" rn="${name}">

    </m2m:cnt>`;
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
    // res.status(200).json({ data: data });
  } catch (error) {
    res.redirect(`?error=${error}`);
    // res.status(500).json({ message: error.message });
  }
}


///Funtion create descriptor and data in sensor
async function createDescriptionAndData(nameData, tool, sensor){
  const xmlBody = `<m2m:cnt xmlns:m2m="http://www.onem2m.org/xml/protocols" rn="${nameData}">
    </m2m:cnt>`;
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
    // const xmlBody = `<m2m:cnt xmlns:m2m="http://www.onem2m.org/xml/protocols" rn="${title}">
    //   <nu>${urlAPI}</nu>
    //   <nct>2</nct>
    // </m2m:cnt>`;
    const xmlBody =  `
    <m2m:sub xmlns:m2m="http://www.onem2m.org/xml/protocols" rn="${title}">
        <nu>${urlAPI}</nu>
        <nct>2</nct>
    </m2m:sub>
    `
    const headers = {
      ...configServerOM2M.infoHost.headers,
      'Content-Type': 'application/xml;ty=23',
    };

    const url = `${configServerOM2M.urlHost()}/${tool}/${sensor}/DATA`;
    const dataText = await indexService.create(url, xmlBody, headers);
    console.log(`dataText: ${dataText}`);
    let data = {};
    await parseString(dataText, function (err, result) {
      if(err) throw err;
      data = result;
    });
    // if (!data) throw new Error('Error !!!');
    res.status(200).json({ data: data });
  } catch (error) {
    // res.redirect('/');
    console.log('error: ' + error.message);
  }
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
    const {tool, sensor} = req.query;
    if(!tool){
      throw new Error('Tool not empty!!!');
    }
    const uri = `${tool ? '/'+tool: ''}${sensor ? '/'+sensor: ''}` ;
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
  getAllData,
  getSensorTool,
  getAllDataLa,
  getAllDataOl,
  getDataTool,
  getInfoTool,
  getSensorData,
  postCreateTool,
  postCreateSensor,
  postCreateContainerInSensor,
  getInfoDataSensor,
  deleteById,
  getCreateTool,
  getCreateSensorTool,
  deleteQuery,
  getCreateDataSubcribe,
  postCreateDataSubcribe
};
