$(document).ready(function () {
    // Get CSRF token from the meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Handle course enrollment
    $('#enrollNow').on('click', function (event) {
        event.preventDefault();  // Prevent default anchor tag behavior

        const courseId = $(this).data('course-id'); // Get the course ID
        console.log("Course ID to enroll:", courseId); // Log the course ID

        // Send POST request to enroll
        fetch(`http://127.0.0.1:8000/courses/${courseId}/enroll/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include CSRF token
            },
            body: JSON.stringify({
                course_id: courseId, // Send course ID in the request body
            }),
            credentials: 'same-origin',  // Ensure cookies (sessions) are sent with the request
        })
        .then(response => {
            console.log("Response:", response); // Log the response object

            // Handle if the user is not logged in
            if (response.status === 401) {
                alert('You must be logged in to enroll in a course.');
                window.location.href = '/login/';  // Redirect to login if not authenticated
                throw new Error('Not logged in');
            }

            // Handle if the request is redirected to the login page
            if (response.redirected) {
                alert('Redirected to login. Please log in first.');
                window.location.href = response.url;  // Redirect user to login page
                throw new Error('Redirected to login');
            }

            // Handle invalid methods (405)
            if (response.status === 405) {
                alert('Method not allowed. Please check your server-side URL configuration.');
                throw new Error('Method not allowed');
            }

            // Handle general request failure
            if (!response.ok) {
                throw new Error('Failed to enroll in course.');
            }

            return response.json();  // Parse the JSON response
        })
        .then(data => {
            console.log("Response data:", data); // Log the parsed response JSON

            // Handle success response
            if (data.success) {
                alert(data.success);
                // Optionally, you can update the UI to show unlocked chapters or enrolled status
                // Example: $('#chapters-container').html(data.unlocked_chapters);
            } else {
                alert(data.error || 'An error occurred.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message || 'An unexpected error occurred.');
        });
    });
});
