const configServerOM2M = require("../utils/config_om2m");

const getAllData = async () => {
    const data = await fetch(configServerOM2M.urlHostListData("IOT_TOOL_KIT_1", "DHT11", "DATA"), {
        headers: configServerOM2M.infoHost.headers,
    });
    return data.json();
}

const getFirstData = async () => {
    const data = await fetch(configServerOM2M.urlHostLa("IOT_TOOL_KIT_1", "DHT11", "DATA"), {
        headers: configServerOM2M.infoHost.headers,
    });
    return data.json();
}

const getLastData = async () => {
    const data = await fetch(configServerOM2M.urlHostOl("IOT_TOOL_KIT_1", "DHT11", "DATA"), {
        headers: configServerOM2M.infoHost.headers,
    });
    return data.json();
}

const findInfo = async (tool = '', sensor = '', queryData = 'rcn=4') => {
    const data = await fetch(configServerOM2M.urlHostListData(tool, sensor, queryData), {
        headers: configServerOM2M.infoHost.headers,
    });
    return data.json();
}

const findById = async (id) => {
    const url = `${configServerOM2M.infoHost.host}/${configServerOM2M.infoHost.uriById(id)}?rcn=4`;
    const data = await fetch(url, {
        headers: configServerOM2M.infoHost.headers,
    });
    return data.json();
}

const getDataMN = async () => {
    const url = `${configServerOM2M.urlHost()}?ty=2&fu=1`;
    const data = await fetch(url, {
        headers: configServerOM2M.infoHost.headers,
    });
    return data.json();
}

const deleteById = async (id) => {
    const url = `${configServerOM2M.infoHost.host}/${configServerOM2M.infoHost.uriById(id)}`;

    const options = {
        method: 'DELETE',
        headers: {...configServerOM2M.infoHost.headers},
    };
    const response = await fetch(url, options);
    console.log('response.status: ', response.status);
    if(response.status >= 400) return false;
    else return true;
}

const deleteQuery = async (uri) => {
    const url = `${configServerOM2M.urlHost()}${uri}`;
    const options = {
        method: 'DELETE',
        headers: {...configServerOM2M.infoHost.headers},
    };
    const response = await fetch(url, options);
    console.log('response.status: ', response.status);
    if(response.status >= 400) return false;
    else return true;
}


const create = async (url,body, headers) => {
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
      };
    //   const url = `${configServerOM2M.urlHost()}/${tool}/${sensor}`;
      let fetchApi = await fetch(url, requestOptions);
      let xmlTextResult = await fetchApi.text();
      return xmlTextResult;
}

const update = () => {

}

module.exports = {
    findById,
    getAllData,
    getFirstData,
    getLastData,
    getDataMN,
    findInfo,
    deleteById,
    create,
    deleteQuery
}