document.addEventListener("DOMContentLoaded", function() {
    const adultPrice = 500; // Price per adult
    const kidPrice = 300; // Price per kid
    const discountThreshold = 5; // Number of tickets for discount eligibility
    const discountPercentage = 10; // 10% discount

    const adultsSelect = document.getElementById("adults");
    const kidsSelect = document.getElementById("kids");
    const paymentAmountSpan = document.getElementById("paymentAmount");
    const paymentLink = document.getElementById("paymentLink");
    const discountMessage = document.getElementById("discountMessage");

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwVGft5FTlxoJv_6Mr73WtELAYkvtCyTefQU2DdOjNQk9TxfJjLs5-MPjtUq3lTYMUkTw/exec';
    const form = document.getElementById('registrationForm');
    const popup = document.getElementById('successPopup');

    // Function to calculate and display the payment amount
    function updatePaymentAmount() {
        const numberOfAdults = parseInt(adultsSelect.value);
        const numberOfKids = parseInt(kidsSelect.value);
        const totalTickets = numberOfAdults + numberOfKids;

        let totalAmount = numberOfAdults * adultPrice + numberOfKids * kidPrice;

        if (totalTickets > discountThreshold) {
            totalAmount *= (1 - discountPercentage / 100);
            discountMessage.textContent = `A ${discountPercentage}% discount has been applied!`;
        } else {
            discountMessage.textContent = '';
        }

        paymentAmountSpan.textContent = `₹${totalAmount}`;
        paymentLink.href = `upi://pay?pa=@upi&pn=John Doe&am=${totalAmount}&cu=INR`;
    }

    // Event listeners to update payment amount when number of adults or kids is changed
    adultsSelect.addEventListener('change', updatePaymentAmount);
    kidsSelect.addEventListener('change', updatePaymentAmount);

    form.addEventListener('submit', async e => {
        e.preventDefault();

        // Create and show the loading bar dynamically
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
            document.body.removeChild(loadingBar); // Remove the loading bar

            if (response.status === 'success') {
                popup.style.display = 'block'; // Show the success popup
            } else {
                alert('Submission failed');
            }
        })
        .catch(error => {
            document.body.removeChild(loadingBar); // Remove the loading bar
            console.error('Error!', error.message);
        });
    });

    function closePopup() {
        popup.style.display = 'none';
    }

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Initialize payment amount display
    updatePaymentAmount();
});
