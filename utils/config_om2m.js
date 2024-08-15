// const host = 'http://mn-cse.cntt-uda.site';
const infoHost = {
    tool: 'IOT_TOOL_KIT_1',
    uri: '~/mn-cse',
    uriById: (id)=>`~/mn-cse/${id}`,
    // host: 'http://mn-cse.cntt-uda.site',
    host: 'https://mncse.cntt-uda.site',
    headers: {
        "Content-Type": "application/json",
        "x-m2m-origin": "admin:admin",
      },
}

const account = (username, password) => {
    return `${username}:${password}`
}

const headerXm2mOrigin = (username, password) => {
    return  {"x-m2m-origin": account(username, password)};
}

function urlHost() {
    return `${infoHost.host}/${infoHost.uri}`;
}

function urlHostListData(name, device, data) {
    // return `${urlHost()}/mn-name/${name}/${device}/${data}?rcn=4`;
    return `${urlHost()}/${name}${device?'/'+device:''}${data ?'?'+data:''}`;
}

function urlHostOl(name, device, data) {
    return `${urlHost()}/${name}/${device}/${data}/ol`;
}

function urlHostLa(name, device, data) {
    return `${urlHost()}/${name}/${device}/${data}/la`;
}

module.exports = {
    urlHostListData,
    urlHostOl,
    urlHostLa,
    urlHost,
    headerXm2mOrigin,
    infoHost
}