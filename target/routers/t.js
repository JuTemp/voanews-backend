"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navs = void 0;
const data = [
    {
        name: 'United Status',
        children: [
            { name: 'US News', url: 'https://www.voanews.com/usa', },
            { name: 'All About America', url: 'https://www.voanews.com/all-about-america', },
            { name: 'Silicon Valley & Technology', url: 'https://www.voanews.com/p/6290.html', },
            { name: 'Immigration', url: 'https://www.voanews.com/immigration', },
        ]
    },
    {
        name: 'World',
        children: [
            { name: 'Africa', url: 'https://www.voanews.com/africa' },
            { name: 'The Americas', url: 'https://www.voanews.com/americas' },
            { name: 'East Asia', url: 'https://www.voanews.com/east-asia' },
            { name: 'Europe', url: 'https://www.voanews.com/europe' },
            { name: 'Middle East', url: 'https://www.voanews.com/middle-east' },
            { name: 'South & Central Asia', url: 'https://www.voanews.com/south-central-asia' },
        ]
    },
    { name: 'Ukraine', url: 'https://www.voanews.com/flashpoint' },
    { name: 'Covid-19 Pandemic', url: 'https://www.voanews.com/p/7783.html' },
    { name: 'VOA News on China', url: 'https://www.voanews.com/china' },
    { name: 'VOA News on Iran', url: 'https://www.voanews.com/iran' },
];
exports.navs = data.map((item, index) => {
    if (!('children' in item))
        return { label: item.name, key: item.name };
    else
        return {
            label: item.name, key: item.name, children: (item.children.map((cell, indexCell) => {
                return { label: cell.name, key: cell.name };
            }))
        };
});
console.log(JSON.stringify(exports.navs, null, 4));
