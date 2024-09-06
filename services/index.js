const configServerOM2M = require("../utils/config_om2m");

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
      let fetchApi = await fetch(url, requestOptions);
      if(fetchApi.status >= 400) throw new Error('Lỗi khởi tạo dữ liệu.');
      return fetchApi.json();
}

const fetchAPI = async (url, reqOption) => {
    try {
        let fetchApi = await fetch(url, reqOption);
        return fetchApi;
    } catch (error) {
        return new Error('Fetch API error!!!');
    }
}

module.exports = {
    findById,
    getDataMN,
    findInfo,
    deleteById,
    create,
    deleteQuery,
    fetchAPI
}



