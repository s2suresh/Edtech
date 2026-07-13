const setOptions = (select, options, placeholder) => {
    select.innerHTML = '';
    select.append(new Option(placeholder, ''));
    options.forEach((option) => select.append(new Option(option.name || option, option.name || option)));
    select.disabled = options.length === 0;
};

const findByName = (items, name) => items.find((item) => item.name === name);

const toDistrictOptions = (districts) => districts.map((district) => (
    typeof district === 'string' ? { name: district, taluks: [] } : district
));

export const initLocationDropdown = () => {
    const picker = document.querySelector('[data-state-index]');
    if (!picker) return;

    const stateSelect = picker.querySelector('#stateSelect');
    const districtSelect = picker.querySelector('#districtSelect');
    const talukSelect = picker.querySelector('#talukSelect');
    const hobliSelect = picker.querySelector('#hobliSelect');
    const villageSelect = picker.querySelector('#villageSelect');
    const help = picker.querySelector('#locationHelp');
    const locationBase = picker.dataset.locationBase || '';
    let activeDistricts = [];

    const resetBelow = (level) => {
        if (level <= 1) setOptions(districtSelect, [], 'Select district');
        if (level <= 2) setOptions(talukSelect, [], 'Select taluk');
        if (level <= 3) setOptions(hobliSelect, [], 'Select hobli');
        if (level <= 4) setOptions(villageSelect, [], 'Select village');
    };

    const loadStateFile = (state) => {
        if (!state.file) {
            activeDistricts = toDistrictOptions(state.districts || []);
            setOptions(districtSelect, activeDistricts, 'Select district');
            help.textContent = 'Districts loaded. Taluk, hobli, and village data can be added later for this state.';
            return Promise.resolve();
        }

        return fetch(`${locationBase}${state.file}`)
            .then((response) => {
                if (!response.ok) throw new Error('State location data not available');
                return response.json();
            })
            .then((stateData) => {
                activeDistricts = toDistrictOptions(stateData.districts || state.districts || []);
                setOptions(districtSelect, activeDistricts, 'Select district');
                help.textContent = 'Districts loaded. Select a district to load taluks where data is available.';
            });
    };

    fetch(picker.dataset.stateIndex)
        .then((response) => {
            if (!response.ok) throw new Error('Location data not available');
            return response.json();
        })
        .then((data) => {
            const states = [...(data.states || []), ...(data.unionTerritories || [])];
            setOptions(stateSelect, states, 'Select state');

            stateSelect.addEventListener('change', () => {
                resetBelow(1);
                activeDistricts = [];
                const state = findByName(states, stateSelect.value);
                if (!state) return;
                loadStateFile(state).catch(() => {
                    activeDistricts = toDistrictOptions(state.districts || []);
                    setOptions(districtSelect, activeDistricts, 'Select district');
                    help.textContent = 'State file could not load. District seed data is shown where available.';
                });
            });

            districtSelect.addEventListener('change', () => {
                resetBelow(2);
                const district = findByName(activeDistricts, districtSelect.value);
                const taluks = district?.taluks || [];
                setOptions(talukSelect, taluks, 'Select taluk');
                help.textContent = taluks.length
                    ? 'Select a taluk to load hoblis.'
                    : 'Taluk data for this district is not added yet. Expand the JSON file to enable this level.';
            });

            talukSelect.addEventListener('change', () => {
                resetBelow(3);
                const district = findByName(activeDistricts, districtSelect.value);
                const taluk = findByName(district?.taluks || [], talukSelect.value);
                const hoblis = taluk?.hoblis || [];
                setOptions(hobliSelect, hoblis, 'Select hobli');
                help.textContent = hoblis.length
                    ? 'Select a hobli to load villages.'
                    : 'Hobli data for this taluk is not added yet.';
            });

            hobliSelect.addEventListener('change', () => {
                resetBelow(4);
                const district = findByName(activeDistricts, districtSelect.value);
                const taluk = findByName(district?.taluks || [], talukSelect.value);
                const hobli = findByName(taluk?.hoblis || [], hobliSelect.value);
                const villages = hobli?.villages || [];
                setOptions(villageSelect, villages, 'Select village');
                help.textContent = villages.length
                    ? 'Village list loaded. Select the student village.'
                    : 'Village data for this hobli is not added yet.';
            });
        })
        .catch(() => {
            help.textContent = 'Unable to load location data right now. Please try again later.';
        });
};
