(async function(){

    window.dataSources = [];
    dataSources.push('MuseData');
    dataSources.push('righthand-training');
    dataSources.push('righthand-testing');
    dataSources.push('feet-training');
    dataSources.push('feet-testing');

    var allData = [];

    let index = 0;
    for(const name of dataSources){
        //loading data
        const orig = await fetch(`data/${name}.csv`);
        const text = await orig.text();

        const data = await text.split('\n').map(row => row.split(','));
        let trimData = await data.map(row => row.map(value => value.trim()));
        if(name == 'MuseData'){
            //last node in example Muse File is always 0, so removing it
            trimData = await trimData.map(row => row.slice(0,row.length - 1));
        }

        if(index == 0){
            window.globalData = trimData;
            document.dispatchEvent(new CustomEvent('globalDataOneLoaded'));
            console.log('first data loaded');
        }
        index++;

        allData.push(trimData);
    }

    window.globalAllData = allData;
    console.log(window.globalAllData);
    // document.dispatchEvent(new CustomEvent('globalDataLoaded'));
    console.log('All data loaded');
})();