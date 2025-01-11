function apiRequest(url, method, data = null, successCallback, errorCallback) {
    const accessToken = localStorage.getItem('accessToken');
  
    $.ajax({
      url: url,
      method: method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
      success: successCallback,
      error: function (xhr) {
        if (xhr.status === 401 && xhr.responseJSON.code === 'token_not_valid') {
          // Token is expired or invalid
          refreshToken()
            .then((newAccessToken) => {
              // Retry the original request with the new access token
              $.ajax({
                url: url,
                method: method,
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                data: data,
                success: successCallback,
                error: errorCallback,
              });
            })
            .catch((refreshError) => {
              console.error('Error refreshing token:', refreshError);
              logoutUser(); // Log out user if refresh fails
            });
        } else {
          if (errorCallback) errorCallback(xhr);
        }
      },
    });
  }
  
  function refreshToken() {
    return new Promise((resolve, reject) => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        reject('No refresh token found.');
        return;
      }
  
      $.ajax({
        url: 'http://127.0.0.1:8000/api/token/refresh/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ refresh: refreshToken }),
        success: function (response) {
          const newAccessToken = response.access;
          localStorage.setItem('accessToken', newAccessToken);
          resolve(newAccessToken);
        },
        error: function (xhr) {
          reject(xhr.responseJSON);
        },
      });
    });
  }
  
  function logoutUser() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login'; // Redirect to login page
  }
  