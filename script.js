let innerUploadImage = document.querySelector(".inner-upload-image");
let input = innerUploadImage.querySelector("input");
let image = document.querySelector("#img");  // Change 'image' to #img based on your HTML
let btn = document.querySelector("#solveButton");  // Button for solving the problem
let text = document.querySelector("#text");  // Fixed typo in querySelector
let output = document.querySelector(".output");

const Api_url = "https://vision.googleapis.com/v1/images:annotate?key=YOUR_GOOGLE_API_KEY";  // Replace with your actual API key

let FileDetails = {
  "mime_type": null,
  "data": null
};

// Function to handle OCR response and display the extracted text
async function generateResponse() {
  const RequestOption = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [{
        image: {
          content: FileDetails.data
        },
        features: [{
          type: "DOCUMENT_TEXT_DETECTION"  // Use DOCUMENT_TEXT_DETECTION for OCR
        }]
      }]
    })
  };

  try {
    let response = await fetch(Api_url, RequestOption);
    let data = await response.json();  // Corrected the method to json()
    let apiResponse = data.responses[0].fullTextAnnotation.text;  // Correct the path for OCR response
    text.innerHTML = apiResponse;
    output.style.display = "block";

    // You can now process the extracted text for math solving here
    // For example, pass the apiResponse to a math solver API or script

  } catch (error) {
    console.error("Error:", error);
  }
}

// Event listener for file input change
input.addEventListener("change", () => {
  const File = input.files[0];
  if (!File) return;

  let reader = new FileReader();
  reader.onload = (e) => {
    let base64data = e.target.result.split(",")[1];
    FileDetails.mime_type = File.type;
    FileDetails.data = base64data;
    innerUploadImage.querySelector("span").style.display = "none";
    innerUploadImage.querySelector("#icon").style.display = "none";
    image.style.display = "block";
    image.src = 'data:' + FileDetails.mime_type + ';base64,' + FileDetails.data;  // Display uploaded image
  };
  reader.readAsDataURL(File);
});

// Trigger file input when the upload area is clicked
innerUploadImage.addEventListener("click", () => {
  input.click();
});

// Trigger solve function when the Solve button is clicked
btn.addEventListener("click", () => {
  if (!FileDetails.data) {
    alert("Please upload an image first.");
    return;
  }
  generateResponse();  // Call OCR and process the text
});
