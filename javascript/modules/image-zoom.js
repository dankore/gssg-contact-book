export default class ZoomImage {
  constructor(imageUrl) {
    this.imageUrl = imageUrl;
    this.zoom();
  }

  zoom() {
    const dialogDiv = document.createElement('div');
    dialogDiv.classList.add('relative', 'z-10');

    const overlay = document.createElement('div');
    overlay.classList.add('fixed', 'inset-0', 'bg-gray-500', 'bg-opacity-75', 'transition-opacity');
    overlay.id = 'dialog';

    const modal = document.createElement('div');
    modal.classList.add('fixed', 'inset-0', 'z-10', 'overflow-y-auto');

    const innerDiv = document.createElement('div');
    innerDiv.classList.add('flex', 'min-h-full', 'items-end', 'justify-center', 'p-4', 'text-center', 'sm:items-center', 'sm:p-0');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('relative', 'transform', 'overflow-hidden', 'rounded-lg', 'bg-white', 'px-4', 'pt-5', 'pb-4', 'text-left', 'shadow-xl', 'transition-all', 'sm:my-8', 'sm:w-full', 'sm:max-w-xl', 'sm:p-6');
    contentDiv.id = 'modal';

    const button = document.createElement('button');
    button.id = 'btn-close-modal';
    button.type = 'button';
    button.classList.add('inline-flex', 'w-full', 'justify-center', 'rounded-md', 'border', 'border-transparent', 'bg-secondary-600', 'px-4', 'py-2', 'text-base', 'font-medium', 'text-white', 'shadow-sm', 'hover:bg-secondary-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-secondary-500', 'focus:ring-offset-2', 'sm:text-sm');
    button.textContent = 'Close';

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('mt-5', 'sm:mt-6');
    buttonDiv.appendChild(button);

    // Create the zoomed image element and add it to the overlay
    var imageToZoom = document.createElement('img');
    imageToZoom.classList.add('object-contain', 'z-50');
    imageToZoom.src = this.imageUrl;
    contentDiv.appendChild(imageToZoom);

    contentDiv.appendChild(buttonDiv);
    innerDiv.appendChild(contentDiv);
    modal.appendChild(innerDiv);

    dialogDiv.appendChild(overlay);
    dialogDiv.appendChild(modal);

    document.body.appendChild(dialogDiv);

    button.addEventListener('click', function (event) {
      dialogDiv.remove();
    });

    // Add an event listener to the overlay to remove it when clicked,
    // unless the click event originates from the zoomed image
    modal.addEventListener('click', function (event) {
      if (event.target !== imageToZoom) {
        dialogDiv.remove();
      }
    });
  }
}
