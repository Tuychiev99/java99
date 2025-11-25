const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("promptInput");
const styleSelect = document.getElementById("styleSelect");
const resultArea = document.getElementById("resultArea");
const loading = document.getElementById("loading");

// ⛔️ 실제 프로젝트에서는 이 KEY를 절대 클라이언트에 넣으면 안 됨.
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";

generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value;
    const style = styleSelect.value;

    if (!prompt) {
        alert("Please enter a prompt!");
        return;
    }

    loading.style.display = "block";
    resultArea.innerHTML = "";

    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-image-1",
                prompt: `${prompt}, style: ${style}`,
                size: "1024x1024"
            })
        });

        const data = await response.json();
        const imageUrl = data.data[0].url;

        loading.style.display = "none";

        // 출력
        resultArea.innerHTML = `
            <h2>Your AI Artwork</h2>
            <img src="${imageUrl}" />
            <button id="saveBtn">Save to Gallery</button>
        `;

        // 저장 기능 (localStorage 기반)
        document.getElementById("saveBtn").addEventListener("click", () => {
            saveArtwork(prompt, style, imageUrl);
        });

    } catch (err) {
        loading.style.display = "none";
        alert("Failed to generate image.");
        console.error(err);
    }
});

// 저장 → localStorage
function saveArtwork(prompt, style, url) {
    let saved = JSON.parse(localStorage.getItem("generatedArt")) || [];

    saved.push({
        title: prompt.substring(0, 20) + "...",
        tags: [style],
        prompt: prompt,
        image: url
    });

    localStorage.setItem("generatedArt", JSON.stringify(saved));

    alert("Saved! Go to the Gallery to see your image.");
}
