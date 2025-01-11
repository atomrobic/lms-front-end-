document.addEventListener('DOMContentLoaded', function () {
  const courseId = 4;  // Example course ID
  const chapterId = 1; // Example chapter ID

  // Get CSRF token from cookie
  function getCSRFToken() {
    const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/);
    return csrfToken ? csrfToken[1] : '';
  }

  // Function to fetch progress data
  function fetchProgress() {
    const csrfToken = getCSRFToken();  // Get the CSRF token from cookies

    fetch(`http://127.0.0.1:8000/courses/${courseId}/chapters/${chapterId}/progress/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, // Assuming token-based authentication
        'X-CSRFToken': csrfToken, // Adding CSRF token to header
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse the response as JSON
    })
    .then(data => {
      if (data.progress) {
        updateProgress(data.progress);
      } else {
        console.error('No progress data found');
      }
    })
    .catch(error => {
      console.error('Error fetching progress:', error);
    });
  }

  // Function to update progress in UI
  function updateProgress(progress) {
    const progressData = [
      { rating: 5, percentage: progress.rating_5 || 0 },
      { rating: 4, percentage: progress.rating_4 || 0 },
      { rating: 3, percentage: progress.rating_3 || 0 },
      { rating: 2, percentage: progress.rating_2 || 0 },
      { rating: 1, percentage: progress.rating_1 || 0 }
    ];

    // Update each progress bar dynamically
    progressData.forEach(data => {
      const ratingSelect = document.querySelector(`select[data-initial-rating="${data.rating}"]`);
      const progressBar = ratingSelect.closest('.row').querySelector('.progress-bar');
      const progressLabel = ratingSelect.closest('.row').querySelector('.text-muted');

      if (progressBar) {
        progressBar.style.width = `${data.percentage}%`;
      }
      if (progressLabel) {
        progressLabel.textContent = `${data.percentage}%`;
      }
    });
  }

  // Fetch progress on page load
  fetchProgress();
});
