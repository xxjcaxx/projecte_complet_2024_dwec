export { getSupabase, getData }


const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlndnRwdWNveHZlZWJpemtuaGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzNTA0ODYsImV4cCI6MjAzMDkyNjQ4Nn0.rDdWANw1LN10BunTH8TKeIAfM-EMlWpTaNyxQSbe30k";

const getSupabase = async (table) => {
    try {
        let response = await fetch(`https://ygvtpucoxveebizknhat.supabase.co/rest/v1/${table}?select=*`, {
            headers: {
                apikey,
                Authorization: `Bearer ${apikey}`
            }
        });
        if(!response.ok){
            return Promise.reject('Bad request')
        }
        return response;
    }
    catch (error) {
        return  Promise.reject('Network Error'); 
    }
};


const getData = (response) =>{
        return response.json()
}
