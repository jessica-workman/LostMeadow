document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const imageInput = document.querySelector('input[name="image"]');
    const customFileLabel = document.getElementById('custom-file-label');
    const fileNameElement = document.getElementById('file-name'); // Add this line to get the new element
    const previewImage = document.getElementById('preview-image');
    const containerIntro = document.querySelector('.container-intro');
    const classifyButton = document.querySelector('button[type="submit"]');
    const imageContainer = document.querySelector('.image-container');
    const container = document.querySelector('.container');

     imageInput.addEventListener('change', () => {
        if (imageInput.files.length > 0) {
            fileNameElement.textContent = imageInput.files[0].name;
        } else {
            fileNameElement.textContent = '';
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const file = imageInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            previewImage.src = reader.result;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });

     classifyButton.addEventListener('click', () => {
        containerIntro.style.display = 'none';
        imageContainer.style.marginTop = '50px';
        container.style.maxWidth = '100%';
    });

    const labelNames = ['Daisy', 'Dandelion', 'Rose', 'Sunflower', 'Tulip'];

    document.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            alert('Error during classification');
            return;
        }

        const predictions = await response.json();
        const resultContainer = document.getElementById('result');
        resultContainer.innerHTML = '';

        const explanationContainer = document.getElementById('explanation');
        explanationContainer.innerHTML = '';

        let wildflowersFound = false;

        predictions.forEach((prediction, index) => {
            if (prediction >= 0.75) {
                wildflowersFound = true;

                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');

                resultItem.innerHTML = 
                `<h2>Congratulations!</h2>
                <h2>You found a wildflower.
                </h2>The neural network believes there is a 
                ${(prediction * 100).toFixed(2)}% 
                chance that a 
                ${labelNames[index]} 
                is in this image.`;

                resultContainer.appendChild(resultItem);

                const explanationItem = document.createElement('div');
                explanationItem.classList.add('explanation');
                explanationItem.innerHTML = 
                `Thank you for using this service. 
                <br> Don't let our countryside be as bland as this webpage.`;

                explanationContainer.appendChild(explanationItem);
            }
        });

        if (!wildflowersFound) {
            const resultItem = document.createElement('div');

            resultItem.innerHTML = 
            `<h3>Unfortunately, the neural network could not 
            find a wildflower in this image.
            </h3>Please upload a different image to try 
            again and help rewild our countryside.
            <br>If problems persist it may be that a 
            wildflower is there but the network hasn't been 
            <br> trained with this species, contact 
            us with any issues.`;

            resultContainer.append(resultItem);

            document.body.style.backgroundImage = null;

            const explanationItem = document.createElement('div');
            explanationItem.classList.add('explanation');

            explanationItem.innerHTML = 
            `Thank you for using this service. 
            <br> Try again with a different image to see 
            if we can find a wildflower. 
            <br> Don't let our countryside be as 
            bland as this webpage. 
            <br> Let's add the colour back to our flower meadows. <br>`;

            explanationContainer.append(explanationItem);

            const brandLink = document.querySelector('.navbar .brand');
            brandLink.innerHTML = 'lostmeadow';
        }

        if (wildflowersFound) {
            const imageUrl = '../static/images/wildflower_meadow.jpeg';

            // Lazy load the image for now
            const preloadImage = new Image();
            preloadImage.src = imageUrl;
            preloadImage.onload = () => {
                document.body.style.background = 
                `url('${highQualityUrl}') no-repeat center center fixed`;
                document.body.style.backgroundSize = 'cover';
            };

            const brandLink = document.querySelector('.navbar .brand');
            brandLink.innerHTML = '<text>found</text>meadow';
        }
    });
});