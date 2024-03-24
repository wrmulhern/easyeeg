(async function(){

    window.dataSources = [];
    dataSources.push('MuseData');
    dataSources.push('righthand-training');
    dataSources.push('righthand-testing');
    dataSources.push('feet-training');
    dataSources.push('feet-testing');

    var allData = [];

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

        allData.push(trimData);
        // window.globalDataSize = trimData.length;
    }

    window.globalAllData = allData;
    console.log(window.globalAllData);
    document.dispatchEvent(new CustomEvent('globalDataLoaded'));
    console.log('data loaded');
})();