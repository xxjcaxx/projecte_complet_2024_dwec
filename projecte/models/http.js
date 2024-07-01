export { getSupabase, updateSupabase, getData, signup, login, fileRequest, getFileRequest, getProfile, updateProfile };
import { apikey, urlBase } from "../environment";
import { from, map, switchMap, of } from "rxjs";

const getSupabase = async (table, columns, search) => {
  try {
    let response = await fetch(
      `${urlBase}rest/v1/${table}?select=${columns ? columns : "*"}${search ? `&${search}` : ""}`,
      {
        headers: {
          apikey,
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      },
    );
    if (!response.ok) {
      return Promise.reject("Bad request");
    }
    return response;
  } catch {
    return Promise.reject("Network Error");
  }
};

const updateSupabase = async (table, search, data) => {
  try {
    let response = await fetch(
      `${urlBase}rest/v1/${table}?select=*${search ? `&${search}` : ""}`,
      {
        method: 'PATCH',
        headers: {
          apikey,
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          Prefer: 'return=representation',
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)

      },
    );
    if (!response.ok) {
      return Promise.reject("Bad request");
    }
    return response;
  } catch {
    return Promise.reject("Network Error");
  }
};

const getData = (response) => response.json();


const signup = async (email, password) => {
  try {
    let response = await fetch(
      `${urlBase}auth/v1/signup`,
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          apikey,

        },
        body: JSON.stringify({ email, password })
      },
    );
    if (!response.ok) {
      return Promise.reject("Bad request");
    }
    return response;
  } catch {
    return Promise.reject("Network Error");
  }
}

const expirationDate = (expires_in) => Math.floor(Date.now() / 1000) + expires_in;

const login = async (email, password) => {
  const status = { success: false };
  try {
    let response = await fetch(
      `${urlBase}auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          apikey,

        },
        body: JSON.stringify({ email, password })
      },
    );
    if (!response.ok) {
      response = await response.json();
      status.errorText = "Fetch error: " + response.error_description;
      return Promise.reject(status);
    }
    response = await response.json();
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('uid', response.user.id);
    localStorage.setItem('email', response.user.email);
    localStorage.setItem('expirationDate', expirationDate(response.expires_in));
    status.success = true;
    return status;
  } catch (err) {
    status.success = false;
    status.errorText = "Network error: " + err;
    return Promise.reject(status);
  }
}

async function fileRequest(url, body) {
  const headersFile = {
    apikey,
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    'x-upsert': true, 
  };
  const response = await fetch(`${urlBase}${url}`, {
    method: 'POST',
    headers: headersFile,
    body,
  });
  if (response.status >= 200 && response.status <= 300) {
    if (response.headers.get('content-type')) {
      const datos = await response.json();
      datos.urlAvatar = `${urlBase}${url}`;
      return datos;
    }
    return {};
  }

  return Promise.reject(await response.json());
}

async function getFileRequest(url) {
  const headersFile = {
    apikey,
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  };
  const response = await fetch(`${url}`, {
    method: 'GET',
    headers: headersFile,

  });
  if (response.status >= 200 && response.status <= 300) {
    if (response.headers.get('content-type')) {
      const datos = await response.blob();
      return datos;
    }
    return {};
  }

  return Promise.reject(await response.json());
}


const getProfile = () => {
  // Obtiene el token de acceso del localStorage
  const access_token = localStorage.getItem('access_token');
  // Obtiene el UID del localStorage
  const uid = localStorage.getItem('uid');
  
  // Convierte la promesa devuelta por getSupabase en un observable
  return from(getSupabase("profiles", "*", `&id=eq.${uid}`))
    .pipe(
      // Usa switchMap para aplanar el observable y cambiar a un nuevo observable basado en la respuesta
      switchMap(getData),
      
      // Usa switchMap para manejar el procesamiento del perfil y la carga del avatar
      switchMap((dataProfile) => {
        // Extrae la URL del avatar del primer objeto del perfil
        const { avatar_url } = dataProfile[0];
        // Inicializa avatar_blob a false
        dataProfile[0].avatar_blob = false;
        
        // Si existe una URL de avatar
        return avatar_url ?
          // Convierte la promesa de getFileRequest en un observable
          from(getFileRequest(avatar_url, access_token)).pipe(
            // Usa map para transformar el resultado del observable
            map(avatarBlob => {
              // Si el avatarBlob es una instancia de Blob, crea una URL para el objeto y asigna a avatar_blob
              dataProfile[0].avatar_blob = avatarBlob instanceof Blob ? URL.createObjectURL(avatarBlob) : '';
              // Retorna el perfil actualizado
              return dataProfile;
            }))
          // Si no hay URL de avatar, retorna el perfil sin modificar
          : of(dataProfile);
      }
      )
    );
}

const updateProfile = async (profile) => {
  const uid = localStorage.getItem('uid');

  const formImg = new FormData();
  formImg.append('avatar', profile.avatar, 'avatarProfile.png');
  const avatarResponse = await fileRequest(`/storage/v1/object/avatars/avatar${uid}.png`, formImg);
  profile.avatar_url = avatarResponse.urlAvatar;
  delete profile.avatar;

  (await updateSupabase(`profiles`, `id=eq.${uid}`, profile));
}