export default function Advertisement() {
  return (
      <div className="advertisement-container">
          <a href="https://icogemhunters.com" target="_blank" rel="noopener noreferrer" ><img src="./images/ads1.webp" alt="Advertisement Image" className="advertisement-image" /></a>
          <div className="advertisement-text">
              <p><a href="https://t.me/gemhuntersclub_bot" target="_blank" rel="noopener noreferrer" >💎 Play to Earn $GEMS – Collect tokens and build your fortune! 💎</a></p>
          </div>

          <style jsx>{`
              .advertisement-container {
                  width: 100%; /* Ensures the entire ad (image + text) covers 80% of the width */
                  max-width: 1000px; /* Limits max width if needed */
                  margin: 0 auto; /* Center-aligns the ad in the viewport */
                  display: flex;
                  flex-direction: column;
                  align-items: center;
              }

              .advertisement-image {
                  width: 100%; /* Makes the image span the full width */
                  max-height: 200px; /* Sets a max height if needed */
                  object-fit: cover; /* Ensures the image covers the full width while maintaining aspect ratio */
                  border-radius: 0.5rem; /* Optional border radius for the image */
              }

              .advertisement-text {
                  background-color: rgb(55 65 81 ); /* Background color for the text section */
                  color: white;
                  text-align: center;
                  padding: 0.4rem;
                  border-radius: 0.5rem;
                  margin-top: 0.5rem; /* Adds spacing between the image and text sections */
                  width: 80%; /* Ensures the text section covers the same width as the image */
              }
          `}</style>
      </div>
  );
}
