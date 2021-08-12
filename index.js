const $h1 = document.querySelector('h1');
$h1.innerHTML = $h1.innerText
  .split('')
  .map((letter) => (letter != ' ' ? `<span>${letter}</span>` : ' '))
  .join('');
