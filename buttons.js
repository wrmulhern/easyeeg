//enable animations button
document.getElementById('animationsButton').addEventListener('click', function() {
    window.animation = true;
    document.getElementById('animationsButton').classList.add('active');
    document.getElementById('noAnimationsButton').classList.remove('active');
    //triggering update function for opposite button as well
    document.getElementById('noAnimationsButton').updateFunction();
    //only update the chart in this one to demonstrate animations
    document.dispatchEvent(new CustomEvent('updateChart'));
});
//disable animations button
document.getElementById('noAnimationsButton').addEventListener('click', function() {
    window.animation = false;
    document.getElementById('noAnimationsButton').classList.add('active');
    document.getElementById('animationsButton').classList.remove('active');
    //triggering update function for opposite button as well
    document.getElementById('animationsButton').updateFunction();
});

//start data point input
document.getElementById('dataStart').addEventListener('change', function() {
    if(document.getElementById('dataStart').value == "" || document.getElementById('dataStart').value < 0){
        window.sliceLeft = 0;
    } else{
        window.sliceLeft = parseInt(document.getElementById('dataStart').value);
    }
    document.dispatchEvent(new CustomEvent('updateChart'));
});

//end data point input
document.getElementById('dataEnd').addEventListener('change', function() {
    if(document.getElementById('dataEnd').value == "" || document.getElementById('dataEnd').value < 0){
        window.sliceRight = 200;
    } else{
        window.sliceRight = parseInt(document.getElementById('dataEnd').value);
    }
    document.dispatchEvent(new CustomEvent('updateChart'));
});

//percent input
document.getElementById('percent').addEventListener('change', function() {
    if(document.getElementById('percent').value == "" || document.getElementById('percent').value < 1 || document.getElementById('percent').value > 100){
        window.percent = 100;
    } else{
        window.percent = parseInt(document.getElementById('percent').value);
    }
    document.dispatchEvent(new CustomEvent('updateChart'));
});





//open node modal button
document.getElementById('openNodes').addEventListener('click', function() {
    generateNodeButtons();
    var myModal = new bootstrap.Modal(document.getElementById('nodesModal'), {
        keyboard: false
    });
    myModal.show();
});

//generate node buttons helper function
document.addEventListener('loadNodes', function() {
    generateNodeButtons();
});

//generate node buttons
function generateNodeButtons() {
    const container = document.getElementById('nodesBody');
    container.innerHTML = '';

    let flexContainer; // Declare outside the loop to keep it accessible

    window.nodes.forEach((value, index) => {
        if(index <= (window.globalData[0].length - 1)){
            // Create a new flex container for every new row
            if (index % 3 === 0 || !flexContainer) {
                flexContainer = document.createElement('div');
                // Apply Bootstrap flex classes
                flexContainer.className = 'd-flex justify-content-evenly mb-1';
                container.appendChild(flexContainer);
            }

            let button = document.createElement('button');
            button.id = `nodeButton${index}`;
            button.type = 'button';
            button.classList.add('btn', 'btn-primary', 'm-1');
            //if a node is false, that button appears active. Reversed to what intuition would say
            if (!value) button.classList.add('active');
            button.textContent = `Node ${index} ${value ? 'Enabled' : 'Disabled'}`;

            button.addEventListener('click', () => {
                button.classList.toggle('active');
                // console.log('button active state toggled');
                window.nodes[index] = !window.nodes[index];
                // Update text to reflect current state after toggle
                button.textContent = `Node ${index} ${window.nodes[index] ? 'Enabled' : 'Disabled'}`;
                document.dispatchEvent(new CustomEvent('updateChart'));
            });

            // Add the button to the last created flex container
            flexContainer.appendChild(button);
        }

        
    });
    //trigger update theme since new buttons need the styling
    // console.log('triggering updateTheme');
    document.dispatchEvent(new CustomEvent('updateTheme'));
}

//enable all nodes
document.getElementById('enableNodes').addEventListener('click', function() {
    window.nodes.forEach((value, index) => {
        if(!window.nodes[index]){
            const button = document.getElementById(`nodeButton${index}`);
            button.click();
        }
    });
    document.dispatchEvent(new CustomEvent('updateChart'));
});
//disable all nodes
document.getElementById('disableNodes').addEventListener('click', function() {
    window.nodes.forEach((value, index) => {
        if(window.nodes[index]){
            const button = document.getElementById(`nodeButton${index}`);
            button.click();
        }
    });
    document.dispatchEvent(new CustomEvent('updateChart'));
});


//creates the dropdown menu elements, with the associated
//even listeners that detect their click and change the data set displayed
document.getElementById('dropdownData').addEventListener('click', function() {
    const dropdownMenu = document.getElementById('dataMenu');

    dropdownMenu.innerHTML = '';
  
    window.dataSources.forEach((item, index) => {

      const newItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = "#";
      link.classList.add('dropdown-item');
      link.textContent = item;
  

      newItem.appendChild(link);
      dropdownMenu.appendChild(newItem);
  

      link.addEventListener('click', function() {
        // console.log(`${item} clicked!`);
        window.selectedDataset = index;
        document.dispatchEvent(new CustomEvent('updateChart'));
      });
    });
  });




// document.addEventListener('mousemove', function(event) {
//     // console.log(`window.mouseMonitor: ${window.mouseMonitor}`);
//     if(window.mouseMonitor == undefined){
//         window.mouseMonitor = 0;
//     } else{
//         window.mouseMonitor++;
//     }
//     console.log(`(${window.mouseMonitor}) Mouse X: ${event.clientX}, Mouse Y: ${event.clientY}`);
// });
