document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from the API
    fetch('http://127.0.0.1:8000/courses/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data);

            if (Array.isArray(data.courses)) {
                const popularSection = document.getElementById('popular-courses');
                
                // Loop through courses and create HTML cards
                data.courses.forEach(course => {
                    const courseCard = `
                        <div class="col">
                            <div class="card h-100">
                                <img src="img/course/small/course-${course.id}.webp" class="card-img-top sh-22" alt="course image" />
                                <div class="card-body">
                                    <h5 class="heading mb-0">
                                        <!-- Dynamic link with course ID -->
                                        <a href="Course.Detail.html?course_id=${course.id}" class="body-link stretched-link">
                                            ${course.title}
                                        </a>
                                    </h5>
                                </div>
                                <div class="card-footer border-0 pt-0">
                                    <div class="text-muted text-small">Price: $${course.price}</div>
                                </div>
                            </div>
                        </div>
                    `;
                    // Append the course card to the popular section
                    popularSection.insertAdjacentHTML('beforeend', courseCard);
                });
            } else {
                console.error('Courses data is not an array.');
            }
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
        });
});
