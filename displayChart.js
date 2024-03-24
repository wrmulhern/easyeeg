
// Listen for the custom event indicating that globalData is loaded. This function
// will initialize the chart
document.addEventListener('globalDataOneLoaded', function() {
    // Ensure there's data to process
    if (!window.globalAllData || window.globalAllData.length === 0) {
        console.error('globalData is not loaded or is empty');
    }

    //allows first initialization of chart to not check globalAllData
    //since it isn't fully loaded
    window.chartUpdates = 0;

    //default values for custom config variables
    //index of currently selected dataset
    window.selectedDataset = 0;
    //currently displayed dataset
    // window.globalData = window.globalAllData[window.selectedDataset];
    //left bound of data shown
    window.sliceLeft = 0;
    //right bound of data shown (data is shown to sliceRight - 1)
    window.sliceRight = 200;
    //table to determine which nodes will be displayed (default to all true)
    window.nodes = Array.from({length: 22}, (item, index) => true);
    console.log(window.nodes);
    // percent of values shown (default to 100)
    window.percent = 100;
    // animations (default true), however is initially set to false so
    // that first load doesn't lag. Second update of chart sets it back to default true
    window.animation = false;


    document.dispatchEvent(new CustomEvent('updateChart'));
});


// Listen for the custom event calling for Chart to be refreshed
// incorporates the config variables I created to make customization easier
// allows for me to make an easy change to a variable, 
// and this function will implement it into the chart
document.addEventListener('updateChart', function() {
    //getting colorscheme for the graph from window variable
    // let optionPicked = window.chosenConfig.graphConfig;

    //picking chart font colors
    // let fontColor = null;
    // if(optionPicked.fontColor != undefined) fontColor = optionPicked.fontColor;
    // let gridColor = null;
    // if(optionPicked.gridColor != undefined) gridColor = optionPicked.gridColor;
    // let titleColor = null;
    // if(optionPicked.titleColor != undefined) titleColor = optionPicked.titleColor;

    //creates chart if it doesn't already exist
    if(window.chartReference == undefined){

        let fontColor = '#fff';
        let gridColor = '#777'
        
        // Creating chart and assigning it to 'eeg' canvas
        // also adds reference to chart pointer to a window variable
        window.chartReference = new Chart(document.getElementById('eeg'), {
            type: 'line',
            options: {
                plugins: {
                    title: {
                        display: true,
                        font: {
                            size: 18
                        },
                        position: 'top'
                    },
                    legend: {
                        labels: {
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                        },
                        title: {
                        },
                        grid: {
                        }
                    },
                    y: {
                        // beginAtZero: true,
                        ticks: {
                        },
                        title: {
                        },
                        grid: {
                        }
                    }
                }
            }
        });
        // console.log(`window.chartReference: ${window.chartReference}`);

        // //adding fontColor if it is not null
        // // console.log(`fontColor: ${fontColor}, gridColor: ${gridColor}, titleColor: ${titleColor}`);
        // if(fontColor != null){
        //     window.chartReference.options.plugins.legend.labels.color = fontColor;
        //     window.chartReference.options.scales.x.ticks.color = fontColor;
        //     window.chartReference.options.scales.x.title.color = fontColor;
        //     window.chartReference.options.scales.y.ticks.color = fontColor;
        //     window.chartReference.options.scales.y.title.color = fontColor;
            
        // }
        // //adding gridColor if it isn't null
        // if(gridColor != null){
        //     window.chartReference.options.scales.x.grid.color = gridColor;
        //     window.chartReference.options.scales.y.grid.color = gridColor;
        // }
        // //adding titleColor if it isn't null
        // if(titleColor != null){
        //     window.chartReference.options.plugins.title.color = titleColor;
        // }




         // //adding fontColor if it is not null
        // // console.log(`fontColor: ${fontColor}, gridColor: ${gridColor}, titleColor: ${titleColor}`);
        // if(fontColor != null){
            window.chartReference.options.plugins.legend.labels.color = fontColor;
            window.chartReference.options.scales.x.ticks.color = fontColor;
            window.chartReference.options.scales.x.title.color = fontColor;
            window.chartReference.options.scales.y.ticks.color = fontColor;
            window.chartReference.options.scales.y.title.color = fontColor;
            
        // }
        // //adding gridColor if it isn't null
        // if(gridColor != null){
            window.chartReference.options.scales.x.grid.color = gridColor;
            window.chartReference.options.scales.y.grid.color = gridColor;
        // }
        // //adding titleColor if it isn't null
        // if(titleColor != null){
            window.chartReference.options.plugins.title.color = fontColor;
        // }
    }

    //setting used dataset to selected dataset
    if(window.chartUpdates != 0){
        window.globalData = window.globalAllData[window.selectedDataset];
    }
    if(window.chartUpdates == 1){
        window.animation = true;
    }
    window.chartUpdates++;

    

    // Generate labels. includes window.percent of values
    const labels = [];
    let tracker = window.percent;
    for(let k = window.sliceLeft; k < window.sliceRight; k++){
        tracker += window.percent;
        if(tracker > 100 || k == (window.sliceRight - 1) || k == window.sliceLeft){
            tracker -= 100;
            labels.push(k);
        }
    }


    // // logic for getting specifc colors for datasets from the config option picked
    // let activeC = null; //variable to determine if default colors are to be used
    // if(optionPicked.color != undefined){
    //     activeC = optionPicked.color; 
    // }
    // let opacity = null;
    // //if an opacity is specified, assign it
    // if(optionPicked.opacity != undefined) opacity = optionPicked.opacity;
    // let color = optionPicked.color;
    // if(activeC != null) color = color.split('.');
    // let colorobject = null;
    // if(activeC != null) colorobject = color[0];
    // let colorpicked = null;
    // if(activeC != null) colorpicked = color[1];
    // let colors = null;
    // if(activeC != null) colors = window.colorschemes[colorobject][colorpicked];
    // if(activeC != null && optionPicked.sliceLeft != undefined && optionPicked.sliceRight != undefined) {
    //     //slices only if there is a custom colorset and both slices are defined
    //     colors = colors.slice(optionPicked.sliceLeft,optionPicked.sliceRight);
    // }

    //creating datasets
    //only creates a dataset for a node if it is window.nodes[index] is true,
    //and the dataset spans from sliceLeft to sliceRight - 1
    //window.percent of values, which is mirrored in labels
    const datasets = [];
    tracker = window.percent;
    for(let index = 0; index < window.globalData[0].length; index++){
        if(window.nodes[index]){
            const dataArray = [];

            let secondaryOpacity = .5;

            for(let k = window.sliceLeft; k < window.sliceRight;k++){
                tracker += window.percent;
                if(tracker > 100 || k == (window.sliceRight - 1) || k == window.sliceLeft){
                    tracker -= 100;
                    dataArray.push(window.globalData[k][index]);
                }
            }

                // // Use modulo operator to cycle through colorScheme array
                // let colorIndex = null;
                // if(activeC != null) colorIndex = index % colors.length;
                // // const borderColor = colors[colorIndex];
                // let borderColor = null;
                // if(activeC != null) {
                //     if(opacity != null){
                //         //if opacity is specified use it
                //         borderColor = Chart.helpers.color(colors[colorIndex]).alpha(opacity).rgbString();
                //     } else{
                //         //else use a default opacity value of 1
                //         borderColor = Chart.helpers.color(colors[colorIndex]).alpha(1).rgbString();
                //     }
                    
                // }
                // let backgroundColor = null;
                // if(activeC != null) {
                //     // Adjust secondary opacity as needed
                //     backgroundColor = Chart.helpers.color(borderColor).alpha(secondaryOpacity).rgbString(); 
                // }
                // Chart.defaults.backgroundColor = Chart.defaults.b

            const dataset = {
                label: 'Node ' + index,
                data: dataArray,
                tension: .1
            }
            // if(activeC != null){
            //     dataset.borderColor = borderColor;
            //     dataset.backgroundColor = backgroundColor;
            // }
            datasets.push(dataset);
        }
    }


    //assigning labels, datasets, animation value, and title
    window.chartReference.data.labels = labels;
    window.chartReference.data.datasets = datasets;
    window.chartReference.options.animation = window.animation;
    window.chartReference.options.plugins.title.text = window.dataSources[window.selectedDataset];

    // then update chart
    window.chartReference.update();
});

// function hexToRGBA(hex, opacity) {
//     let r = 0, g = 0, b = 0;
//     // 3 digits
//     if (hex.length == 4) {
//         r = parseInt(hex[1] + hex[1], 16);
//         g = parseInt(hex[2] + hex[2], 16);
//         b = parseInt(hex[3] + hex[3], 16);
//     }
//     // 6 digits
//     else if (hex.length == 7) {
//         r = parseInt(hex[1] + hex[2], 16);
//         g = parseInt(hex[3] + hex[4], 16);
//         b = parseInt(hex[5] + hex[6], 16);
//     }
//     return `rgba(${r},${g},${b},${opacity})`;
// }
