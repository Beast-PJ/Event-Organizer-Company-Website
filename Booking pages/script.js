document.addEventListener("DOMContentLoaded", function() {
    // Define the updated prices
    const singleEntryPrice = 350;
    const groupAdultPrice = 300;
    const groupKidPrice = 200;
    const kidSinglePrice = 250;
    
    // Threshold for group discount (e.g., 5 tickets or more for a group)
    const groupThreshold = 5;

    const adultsSelect = document.getElementById("adults");
    const kidsSelect = document.getElementById("kids");
    const paymentAmountSpan = document.getElementById("paymentAmount");
    const discountMessage1 = document.getElementById("discountMessage");
    const paymentButton = document.getElementById("paymentButton");
    const payNowButton = document.getElementById("payNowButton");
    const fileInput = document.getElementById("paymentProof");
    const fileNameDisplay = document.getElementById("fileName");
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwVGft5FTlxoJv_6Mr73WtELAYkvtCyTefQU2DdOjNQk9TxfJjLs5-MPjtUq3lTYMUkTw/exec';
    const form = document.getElementById('registrationForm');

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
            window.location.href = `upi://pay?pa=nayansolankure@okicici&pn=Sisters%20Squad&am=${totalAmount}&cu=INR`;
        };
    }



function updatePaymentAmount() {
    const numberOfAdults = parseInt(adultsSelect.value) || 0;
    const numberOfKids = parseInt(kidsSelect.value) || 0;
    const totalTickets = numberOfAdults + numberOfKids;

    let totalAmount = 0;

    // Apply group pricing if total tickets are 5 or more
    if (totalTickets >= groupThreshold) {
        totalAmount = numberOfAdults * groupAdultPrice + numberOfKids * groupKidPrice;
        discountMessage.textContent = `Group Pricing Applied: ₹300 per adult, ₹200 per kid.`;
    } else {
        // Apply individual pricing if less than 5 people
        totalAmount = numberOfAdults * singleEntryPrice + numberOfKids * kidSinglePrice;
        discountMessage.textContent = '';
    }

    paymentAmountSpan.textContent = `₹${totalAmount.toFixed(2)}`;

    // Prepare the payment link
    payNowButton.onclick = function() {
        window.location.href = `upi://pay?pa=nayansolankure@okicici&pn=Sisters%20Squad&am=${totalAmount}&cu=INR`;
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
        popup.id = 'successPopup1';
        popup.innerHTML = `
            <div id="successPopup">
                <span class="close-button" id="closePopupBtn" onclick="closePopup()">&times;</span>
                <h3>Successfully Booked!</h3>
                <p>Your registration has been successfully submitted. Thank you!</p>
                <a href="https://chat.whatsapp.com/I61B8QxML5q5RqpNl1QiN3" target="_blank" id="whatsappBtn">
                    <i class="fab fa-whatsapp"></i> Join WhatsApp Group
                </a>
            </div>
        `;
        document.body.appendChild(popup);
        popup.style.display = 'block';

        document.getElementById("closePopupBtn").addEventListener("click", closePopup);
    }

    function closePopup() {
        const popup = document.getElementById('successPopup1');
        if (popup) {
            popup.remove();
            const form = document.getElementById('registrationForm');
            form.reset(); // Reset all inputs in the form
            paymentAmountSpan.textContent="₹0.00";
            discountMessage1.textContent="";
            fileNameDisplay.innerHTML = `<i class="fas fa-cloud-upload-alt"></i>`;        }
    }
   
    

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
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

