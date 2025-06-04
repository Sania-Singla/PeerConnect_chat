import { useState, useEffect } from 'react';
import { getTechLogos } from '../Lib/utils.js';

export default function DisplayTechIcons({ techStack }) {
    const [techIcons, setTechIcons] = useState([]);

    useEffect(() => {
        (async function () {
            const logos = await getTechLogos(techStack);
            setTechIcons(logos);
        })();
    }, [techStack]);

    return (
        <div className="flex flex-row">
            {techIcons.slice(0, 3).map(({ tech, url }, i) => (
                <div
                    key={tech}
                    className={`relative rounded-full border border-gray-200 bg-white shadow-md p-[5px] hover:scale-105 transition-transform duration-200 ${i > 0 && '-ml-1'}`}
                >
                    <img
                        src={url}
                        alt={tech}
                        className="size-6 object-contain rounded-full"
                        loading="lazy"
                    />
                </div>
            ))}
        </div>
    );
}
