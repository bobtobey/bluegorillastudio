// Site scripts

// Reusable functions
// Y combinator for recursion
function Y(f) {
    return (function (x) {
        return f(function (v) { return x(x)(v); });
    })(function (x) {
        return f(function (v) { return x(x)(v); });
    });
}

// Resuable asynchronous function that fetches JSON data from the specified URL.
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // console.log(data);
        return await data;
    } catch (error) {
        console.error('Error in fetchData:', error);
        throw error; // Rethrow so consumer can handle
    }
}


// Fetch a random quote data from the API
async function quoteOfTheDay(url) {
    try {
        // await the quote of the day
        // https://theysaidso.com/api
        const data = await fetchData(url);
        const quoteObj = data.contents.quotes[0];
        console.log(quoteObj);
        // Insert the quote text and author into the page
        document.querySelector('.quote-text').innerHTML = `${quoteObj.quote} — ${quoteObj.author}`;
    } catch (error) {
        console.error('Error in fetching quoteOfTheDay:', error);
    }
}

// Initialize Dialogs on the page
function dialogInitializer(event, options = {}) {
    // Default function parameters
    const {
        alert = false,
        update = false
    } = options;

    // Confirm closest element has the data-dialog-target attribute
    const targetElement = event.target.closest('[data-dialog-target]');    

    // approach 2
    if (!targetElement) {
        console.error('No target element with data-dialog-target attribute found.');
        return;
    }
    // Get dialog target id
    const dialogTarget = targetElement.getAttribute('data-dialog-target');
    if (!dialogTarget) {
        console.error('No dialog ID specified.');
        // console.log(dialogTarget);
        return;
    }
    // Set dialog element
    const dialog = document.querySelector(`[data-id="${dialogTarget}"]`);
    if (!dialog) {
        // console.error('Dialog element not found.');
        // console.log(dialog);
        return;
    }

    // Call Dialog functions
    dialogToggle(dialog, targetElement);
    // Check Dialog Display State
    const dialogState = dialog.getAttribute('data-dialog-state');
    // Run Alerts & Updates if needed
    if ((alert || update) && dialogState === 'true') {
        dialogAlertAndUpdate(dialog, { alert, update });
    }
}

// Toggle Dialog Display
function dialogToggle(dialog, dialogCaller) {
    // Get current display state
    const currentState = window.getComputedStyle(dialog).display;

    if (currentState === 'none') {
        // Store the original border color if not already stored
        if (!dialog.dataset.originalBorderColor) {
            dialog.dataset.originalBorderColor = window.getComputedStyle(dialog).borderColor;
        }

        dialog.style.display = 'block';
        dialog.setAttribute('data-dialog-state', 'true');
        dialogCaller.classList.remove('btn-target-off');
        dialogCaller.classList.add('btn-target-on');
    } else {
        dialog.style.display = 'none';
        dialog.setAttribute('data-dialog-state', 'false');
        dialog.style.borderColor = dialog.dataset.originalBorderColor; // Reset to original border color when closing
        dialogCaller.classList.remove('btn-target-on');
        dialogCaller.classList.add('btn-target-off');
    }
}

//  Dialog Alert & Update Methods
function dialogAlertAndUpdate(dialog, { alert, update}) {
    const alertElement = dialog.querySelector('.alert');
    const updateElement = dialog.querySelector('.update');
    // Set alert/update styles
    if (alert && alertElement) {
        dialog.style.borderColor = 'red';
        alertElement.style.display = 'block';
    } else if (update && updateElement) {
        dialog.style.borderColor = 'green';
        updateElement.style.display = 'block';
    } else {
        dialog.style.borderColor = dialog.dataset.originalBorderColor; // Reset to original 
    }
}

// Hide or show visibility of button based on scroll distance from VP top
function scrollPage(button) {    
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        button.parentElement.style.display = "block";
    } else {
        button.parentElement.style.display = "none";
    }
}

// Universal Event Listener
document.addEventListener('DOMContentLoaded', function() {
    // Window listeners
    window.addEventListener('scroll', function() {
        const backtotopButton = document.querySelector(`.btn-backtotop`);
        if(backtotopButton) {
            scrollPage(backtotopButton);
        }
    });
    // Document listeners
    document.body.addEventListener('click', function(event) {
        const evntTarget= event.target;
        // console.log("Clicked element:", evntTarget);

        if(evntTarget.closest('[data-dialog-toggle="true"]')) {
            event.preventDefault();
            dialogInitializer(event, {
                alert: false,
                update: false
            });
        };

        // Close dialog with button
        if(evntTarget.closest('.btn-close')) {
            const btnClose = evntTarget.closest('.portfolio-assets-bloc');
            if(btnClose) {
                dialogToggle(btnClose);
            }
        }

        // Scroll page to top
        if(evntTarget.closest('[data-btn-backtop="true"')) {
            window.scrollTo({
              top: 0,
              behavior: 'smooth' // Smooth scrolling
            });
        }
    })
});