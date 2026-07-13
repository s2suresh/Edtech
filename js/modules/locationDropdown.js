const setOptions = (select, options, placeholder) => {
    select.innerHTML = '';
    select.append(new Option(placeholder, ''));
    options.forEach((option) => select.append(new Option(option.name || option, option.name || option)));
    select.disabled = options.length === 0;
};

const findByName = (items, name) => items.find((item) => item.name === name);

export const initLocationDropdown = () => {
    const picker = document.querySelector('[data-location-source]');
    if (!picker) return;

    const stateSelect = picker.querySelector('#stateSelect');
    const districtSelect = picker.querySelector('#districtSelect');
    const talukSelect = picker.querySelector('#talukSelect');
    const hobliSelect = picker.querySelector('#hobliSelect');
    const villageSelect = picker.querySelector('#villageSelect');
    const help = picker.querySelector('#locationHelp');

    const resetBelow = (level) => {
        if (level <= 1) setOptions(districtSelect, [], 'Select district');
        if (level <= 2) setOptions(talukSelect, [], 'Select taluk');
        if (level <= 3) setOptions(hobliSelect, [], 'Select hobli');
        if (level <= 4) setOptions(villageSelect, [], 'Select village');
    };

    fetch(picker.dataset.locationSource)
        .then((response) => {
            if (!response.ok) throw new Error('Location data not available');
            return response.json();
        })
        .then((data) => {
            setOptions(stateSelect, [data.state], 'Select state');

            stateSelect.addEventListener('change', () => {
                resetBelow(1);
                if (stateSelect.value !== data.state.name) return;
                setOptions(districtSelect, data.districts, 'Select district');
                help.textContent = 'Select a district to load taluks where data is available.';
            });

            districtSelect.addEventListener('change', () => {
                resetBelow(2);
                const district = findByName(data.districts, districtSelect.value);
                const taluks = district?.taluks || [];
                setOptions(talukSelect, taluks, 'Select taluk');
                help.textContent = taluks.length
                    ? 'Select a taluk to load hoblis.'
                    : 'Taluk data for this district is not added yet. Expand the JSON file to enable this level.';
            });

            talukSelect.addEventListener('change', () => {
                resetBelow(3);
                const district = findByName(data.districts, districtSelect.value);
                const taluk = findByName(district?.taluks || [], talukSelect.value);
                const hoblis = taluk?.hoblis || [];
                setOptions(hobliSelect, hoblis, 'Select hobli');
                help.textContent = hoblis.length
                    ? 'Select a hobli to load villages.'
                    : 'Hobli data for this taluk is not added yet.';
            });

            hobliSelect.addEventListener('change', () => {
                resetBelow(4);
                const district = findByName(data.districts, districtSelect.value);
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
