import axios from "axios";

const getNewAccessToken = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await $axios.post("/auth/refresh", {
      token
    });
    return data.access;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const $axios = axios.create({
  baseURL: "https://dwit-ecommerce.herokuapp.com/api",
  timeout: 30000,
  withCredentials: true
});

// Add a response interceptor
$axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log(response.status);
    return response;
  },
  async function (error) {
    if (error.response) {
      if (error.response.status === 403) {
        const token = await getNewAccessToken();
        $axios.defaults.headers.Authorization = `Bearer ${token}`;
        $axios({
          ...error.config,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
