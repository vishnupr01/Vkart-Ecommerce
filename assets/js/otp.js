document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("sendOTPButton");
  const registerButton=document.getElementById("registerID")
  const timerDisplay = document.getElementById("timer");
  let countdown;
  startTimer()
  startButton.addEventListener("click", startTimer)
 registerButton.addEventListener("click", startTimer);

  function startTimer() {
    // Show the timer when the button is clicked
    timerDisplay.style.display = 'block';
 
    let secondsRemaining = 30;
    updateTimerDisplay(secondsRemaining);

    countdown = setInterval(function () {
      secondsRemaining--;

      if (secondsRemaining >= 0) {
        updateTimerDisplay(secondsRemaining);
      } else { 
        clearInterval(countdown);
        timerDisplay.style.display = 'none'; // Hide the timer when it expires

      }
    }, 1000);
  }
 
  function updateTimerDisplay(seconds) {
    timerDisplay.textContent = seconds;
  }
});