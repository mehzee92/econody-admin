export const apiUrl = "http://31.97.150.58:8000"; //"http://31.97.150.58:8000";

export const toPeriod=(totalSeconds)=> {
  const days = Math.floor(totalSeconds / (24 * 3600)); // 1 day = 86400 seconds
  const remainingSecondsAfterDays = totalSeconds % (24 * 3600);
  const hours = Math.floor(remainingSecondsAfterDays / 3600); // 1 hour = 3600 seconds
  const remainingSecondsAfterHours = remainingSecondsAfterDays % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60); // 1 minute = 60 seconds
  let str = "";
  if(days>0) { str += days+"day "; }
  if(days>0 && hours>0) { str += ", ";  }
  if(hours>0) { str += hours+"hr "; }
  if((days>0 || hours>0) && minutes>0) { str += ", ";  }
  if(minutes>0) { str += minutes+"min"; }
  return str;
}


export const getSolanaTimestamp=async(connection)=> 
{
  try {
      const slot = await connection.getSlot();
      const blockTime = await connection.getBlockTime(slot);
      return blockTime;
  } catch (error) {
      console.error("Error fetching timestamp:", error);
      return 0;
  }
}


export const getTokenBalance=async(wallet, TOKEN_MINT, callback)=> {
  try {
      const { connection } = await getConfig(wallet);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet, { mint: TOKEN_MINT });
      if (tokenAccounts.value.length === 0) 
      {
        callback(67);
      } 
      else 
      {
        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        callback(balance);
      }
  } catch (error) 
  {
      alert(error.message);
      console.error("Error getting token balance:", error);
      callback(68);
      return;
  }
}






export const toDate=(timestamp)=> 
{
    if (timestamp.toString().length === 10) 
    {
      timestamp *= 1000;
    }
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export const postData=async(url, data)=> {

  const result  = await checkToken();  
  if(result.statusCode != 200) { 
    return result; 
  }    
  const accessToken = result.accessToken;
  const fullUrl = apiUrl+url;
  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
            'Content-Type': 'application/json',
            'accessToken':accessToken
        },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json(); 
    return result;
  } catch (error) {
    console.error('Error posting data:', error);
    return {status:"error", message:"Error: "+error.message}
  }
}

export const adminLogin=async(url, data)=> {
  const fullUrl = apiUrl+url;
  data = JSON.stringify(data);
  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json(); 
    return result;
  } catch (error) {
    console.error('Error posting data:', error);
    return {status:"error", message:"Error: "+error.message}
  }
}



export const adminLogout=async(url, data)=> {
  const fullUrl = apiUrl+"/api/auth/token";
  try {
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json(); 
    sessionStorage.setItem("accessToken", "");
    sessionStorage.setItem("refreshToken", "");
    return result;
  } catch (error) {
    console.error('Error posting data:', error);
    return {status:"error", message:"Error: "+error.message}
  }
}




export const uploadImage=async(file)=> 
{
  const formData = new FormData();
  formData.append("file_name", file);
  const url = apiUrl+'/api/upload';
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}



export const isTokenExpired=(token)=> 
{
  if (!token) return true;
  const now = Date.now() / 1000;
  return token.exp < now;
}


export const decodeJWT=(token)=> 
{
  if(!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}


export const signOut=async()=>{

  const url = apiUrl+"/api/auth/token";
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include", 
    });
    const result = await response.json(); 
    return result;
  } catch (error) {
    console.error('Error posting data:', error);
    return {status:"error", message:error.message}
  }  
};




export const getNewAccessToken=async()=> 
{
  try 
  {
  
    const refreshToken = sessionStorage.getItem("refreshToken");

    if(!refreshToken || refreshToken==undefined || refreshToken==null)
    {
      return { status:"error" }
    }

    const url = apiUrl+"/api/auth/token";
    const response = await fetch(url, 
    {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'refreshToken': refreshToken
        },
        credentials: "include", 
        body: JSON.stringify({refreshToken})
    });

    if (!response.ok) { return { status:"error", statusCode:403 }; }

    const result = await response.json();
    sessionStorage.setItem("accessToken", result.accessToken);
    return  {...result, status:"success", statusCode:200 };

  } 
  catch (error) 
  {
    console.error('Error posting data:', error);
    alert(error.message);
    return {status:"error", statusCode:0, message:error.message}
  }
}


export const getCookie=(name)=> {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}



export const checkToken=async()=> {

  const accessToken = sessionStorage.getItem("accessToken");
  if(!accessToken || accessToken==undefined || accessToken==null)
  {
    return { status:"error" }
  }

  const data = decodeJWT(accessToken);
  const b = isTokenExpired(data);
  if(b) 
  {
    const result = await getNewAccessToken();
    if(result.statusCode==200) 
    {
        const accessToken = sessionStorage.getItem("accessToken");
        const data = decodeJWT(accessToken);
        const _b = isTokenExpired(data);     
        if(_b) 
        { 
          return { status:"error", statusCode:403, message:"CheckToken: Refresh token expired " }; 
        } 
        else 
        {
          return { status:"success", statusCode:200, ...data };
        }
    } 
    else 
    {
      return { status:"error", statusCode:403, message:"CheckToken: failed to get new acces token " }
    }
  } 
  else 
  {
    return { status:"success", accessToken, statusCode:200, ...data };
  }
}





export const getData=async(url)=> 
{
  const result  = await checkToken();
  
  if(result.statusCode != 200) { 
    return result; 
  }
  const accessToken = result.accessToken;
  try {
    const response = await fetch(apiUrl+url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'accessToken':accessToken
      },
    });

    const result = await response.json();
    return result;
  } 
  catch (error) 
  {
    console.error('Error posting data:', error);
    return {status:"error", statusCode:0, message:error.message}
  }
}



export const getOrdinalSuffix=(n)=> 
{
  const remainder10 = n % 10;
  const remainder100 = n % 100;
  if (remainder100 >= 11 && remainder100 <= 13) {
    return 'th';
  }
  switch (remainder10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}



export const round=(val)=>{
   return Math.round(1000*val)/1000;
}


export const toNaturalFormat=(isoDate)=> 
{
  const date = new Date(isoDate);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
 };
  return date.toLocaleString(undefined, options); // use user's local time zone
}


export const toNaturalFormatDTG=(isoDate)=> {
  const date = new Date(isoDate);
  const options = {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, 
 };
  return date.toLocaleString(undefined, options); // use user's local time zone
}


export const toDHM=(seconds)=> {
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds %= 24 * 60 * 60;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  let output = "";
  if(days>0) { 
    output += days+" days";
     return output;
  }
  if(hours>0 && days>0) { output += ", " }
  if(hours>0) { output += ""+hours+" hrs" }
  return output;
}



export const cls = {
  label:"inline-block w-28 text-gray-700 text-center cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold transition",
  input:"w-full border text-gray-700 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-700"
}