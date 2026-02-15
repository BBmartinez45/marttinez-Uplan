const btn = document.getElementById('menu-btn')
const menu = document.getElementById('mobile-menu')
const icon = btn.querySelector('i')

let open = false

btn.addEventListener('click', (e) => {
  e.stopPropagation()
  open = !open

  if (open) {
    menu.classList.remove('opacity-0', '-translate-y-6', 'pointer-events-none')
    menu.classList.add('opacity-100', 'translate-y-0')
    icon.classList.replace('fa-bars', 'fa-xmark')
    btn.classList.add('rotate-90')
  } else {
    closeMenu()
  }
})

function closeMenu() {
  menu.classList.add('opacity-0', '-translate-y-6', 'pointer-events-none')
  menu.classList.remove('opacity-100', 'translate-y-0')
  icon.classList.replace('fa-xmark', 'fa-bars')
  btn.classList.remove('rotate-90')
  open = false
}

document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    closeMenu()
  }
})



  const messages = [
    "upPlan enforces discipline and structure for serious traders.",
    "Maintain a discipline score above 75% to stay subscribed.",
    "Trade accountability and journaling are reviewed weekly.",
    "Break trading rules and your subscription is revoked.",
    "Funded and retail traders use upPlan to stay consistent.",
    "Discipline is non-negotiable at upPlan."
  ];

  const toast = document.getElementById("info-toast");
  const toastText = document.getElementById("toast-text");

  let index = 0;

  function showToast() {
    toastText.textContent = messages[index];

    // Show
    toast.classList.remove("opacity-0", "translate-y-6");
    toast.classList.add("opacity-100", "translate-y-0");

    // Hide after 4s
    setTimeout(() => {
      toast.classList.remove("opacity-100", "translate-y-0");
      toast.classList.add("opacity-0", "translate-y-6");
    }, 4000);

    // Next message
    index = (index + 1) % messages.length;
  }

  // First run
  setTimeout(showToast, 1500);

  // Loop
  setInterval(showToast, 6000);



  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const content = item.querySelector('.faq-content');
      const icon = btn.querySelector('i');

      const isOpen = content.style.maxHeight;

      // Close all
      document.querySelectorAll('.faq-content').forEach(c => c.style.maxHeight = null);
      document.querySelectorAll('.faq-btn i').forEach(i => i.classList.remove('rotate-45'));

      // Open current
      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.classList.add('rotate-45');
      }
    });
  });







