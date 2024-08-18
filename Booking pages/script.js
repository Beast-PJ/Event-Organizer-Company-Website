document.addEventListener("DOMContentLoaded", function() {
    const adultPrice = 500; // Price per adult
    const kidPrice = 300; // Price per kid
    const discountThreshold = 5; // Number of tickets for discount eligibility
    const discountPercentage = 10; // 10% discount

    const adultsSelect = document.getElementById("adults");
    const kidsSelect = document.getElementById("kids");
    const paymentAmountSpan = document.getElementById("paymentAmount");
    const discountMessage1 = document.getElementById("discountMessage");

    const payNowButton = document.getElementById("payNowButton");

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwVGft5FTlxoJv_6Mr73WtELAYkvtCyTefQU2DdOjNQk9TxfJjLs5-MPjtUq3lTYMUkTw/exec';
    const form = document.getElementById('registrationForm');
    const generateQRCodeButton = document.getElementById("generateQRCodeButton");

    function updatePaymentAmount() {
        const numberOfAdults = parseInt(adultsSelect.value) || 0;
        const numberOfKids = parseInt(kidsSelect.value) || 0;
        const totalTickets = numberOfAdults + numberOfKids;

        let totalAmount = numberOfAdults * adultPrice + numberOfKids * kidPrice;

        if (totalTickets > discountThreshold) {
            const discountAmount = (totalAmount * discountPercentage) / 100;
            totalAmount -= discountAmount;
            discountMessage.textContent = 'Discount Applied: ${discountPercentage}% off';
        } else {
            discountMessage.textContent = '';
        }

        paymentAmountSpan.textContent = `₹${totalAmount.toFixed(2)}`;

        // Prepare the payment link
        payNowButton.onclick = function() {
            window.location.href = `upi://pay?pa=@upi&pn=John%20Doe&am=${totalAmount}&cu=INR`;
        };
    }

    function updatePaymentAmount() {
        const numberOfAdults = parseInt(adultsSelect.value) || 0;
        const numberOfKids = parseInt(kidsSelect.value) || 0;
        const totalTickets = numberOfAdults + numberOfKids;

        let totalAmount = numberOfAdults * adultPrice + numberOfKids * kidPrice;

        if (totalTickets > discountThreshold) {
            const discountAmount = (totalAmount * discountPercentage) / 100;
            totalAmount -= discountAmount;
            discountMessage.textContent = `Discount Applied: ${discountPercentage}% off`;
        } else {
            discountMessage.textContent = '';
        }

        paymentAmountSpan.textContent = `₹${totalAmount.toFixed(2)}`;

        // Prepare the payment link
        payNowButton.onclick = function() {
            window.location.href = `upi://pay?pa=yourupi@upi&pn=John%20Doe&am=${totalAmount}&cu=INR`;
        };
    }

 

    // Event listeners to update payment amount and QR code when number of adults or kids changes
    adultsSelect.addEventListener('change', updatePaymentAmount);
    kidsSelect.addEventListener('change', updatePaymentAmount);

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const loadingBar = document.createElement('div');
        loadingBar.id = 'loadingBar';
        loadingBar.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(loadingBar);

        const formData = new FormData(form);
        const paymentProofFile = formData.get('paymentProof');
        
        // Convert the file to a base64 string
        const base64String = await convertToBase64(paymentProofFile);

        const data = {
            name: formData.get('name'),
            numberOfAdults: formData.get('adults'),
            numberOfKids: formData.get('kids'),
            wpContact: `${formData.get('wpContact')}`,
            paymentAmount: paymentAmountSpan.textContent.replace('₹', ''),
            paymentProof: base64String
        };

        fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(response => {
            document.body.removeChild(loadingBar);

            if (response.status === 'success') {
                showSuccessPopup();
            } else {
                alert('Submission failed');
            }
        })
        .catch(error => {
            document.body.removeChild(loadingBar);
            console.error('Error!', error.message);
        });
    });

    function showSuccessPopup() {
        const popup = document.createElement('div');
        popup.id = 'successPopup';
        popup.innerHTML = `
            <button class="x" id="closePopupBtn">✖</button>
            <h2>Booking Successful!</h2>
            <p>Thank you for booking with us. We have received your booking.</p>
        `;
        document.body.appendChild(popup);
        popup.style.display = 'block';

        document.getElementById("closePopupBtn").addEventListener("click", closePopup);
    }

    function closePopup() {
        const popup = document.getElementById('successPopup');
        if (popup) {
            popup.remove();
        }
    }

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    

    // Initialize payment amount and QR code display
    updatePaymentAmount();
    
});

document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById("paymentProof");
    const fileNameDisplay = document.getElementById("fileName");

    fileInput.addEventListener("change", function(event) {
        const fileName = event.target.files[0].name;
        fileNameDisplay.textContent = `Selected file: ${fileName}`;
    });
});

