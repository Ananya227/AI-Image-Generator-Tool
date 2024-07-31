const generateForm = document.querySelector(".generate.form");
const imageGallery = document.querySelector(".image-gallary");
const OPENAI_API_KEY ="sk-proj-JdQJv6pr5PyFEm32ujAHT3BlbkFJZcK3Fo9UEwKwRYwOsPjA";
let isImageGenerating = false;
const  updateImageCard = (ImageDataArray) => {

    ImageDataArray.forEach((imgObject , index) => {
     const imgCard = imageGallery.querySelectorAll(".img-card")[index];
     const imgElement = imgCard.querySelector("img");
     const downloadBtn = imgCard.querySelector(".download-btn");

     const aiGeneratedImg = `data:image/jpeg;base64,${imgObject}`;
     imgElement.src = aiGeneratedImg;
  
  //when the image is loading , remove the loading class
     imgElement.onload = () => {
        imgCard.classList.remove("loading");
        downloadBtn.setAttribute("href" , aiGeneratedImg);
        downloadBtn.setAttribute("download" , `${new Date().getTime}.jpg`);
     }
    }
);
}
const generateAiImages =async(userPrompt , userImgQuantity) => {
    try{

      const response = await fetch("https://api.openai.com/v1/images/generations",
        {
            method: "POST" ,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body:JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size:"512x512",
                response_format: "b64_json"
            })
        }
      );
      if(!response.ok) throw new Error("Failed to generate images! Please try again.");
      const { data} = await response.json();// get data from response
      updateImagecard([...data]);
    } catch(error){
        alert(error.message);
    }
    finally{
        isImageGenerating = false;
    }
}
const handleFormSubmission = (e) => {
 e.preventDefault();
 if(isImageGenerating ) return;
 isImageGenerating = true;

 const userPrompt = e.srcElement[0].value;
 const userImgQuantity = e.srcElement[1].value;

 const imgCardMarkup = Array.from({length: userImgQuantity} , () =>
`<div class="img-card loading">
<img src="loader.svg" alt="img">
<a href="#" class="download-btn">
<img src="download.svg" alt="download icon">

</a>



</div>`
).join("");

imageGallery.innerHTML = imgCardMarkup;
generateAiImages(userPrompt , userImgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);