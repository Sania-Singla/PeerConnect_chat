import { icons } from '@/Assets/icons';
import { CONTRIBUTORS } from '@/Constants/constants';
import { ContributorCard } from '@/Components';

export default function SupportPage() {
    const contributorElements = CONTRIBUTORS?.map((contributor) => (
        <ContributorCard key={contributor.name} contributor={contributor} />
    ));

    return (
        <div className="h-full w-full text-black flex flex-col pt-5 justify-start items-center gap-6">
            <div className="flex items-center justify-center flex-col gap-3">
                <div className="rounded-full size-[90px] p-4 bg-[#f9f9f9] overflow-hidden drop-shadow-sm hover:brightness-105 w-fit">
                    <div className="size-full fill-[#3a67d8]">
                        {icons.support}
                    </div>
                </div>

                <h1 className="text-3xl font-bold w-full text-center mb-1">
                    Connect for any Issue or Support
                </h1>

                <p className="text-center text-gray-500 max-w-2xl text-[15px] mb-2">
                    Our contributor team is here to help you with any bugs,
                    issues, or guidance you may need. Reach out and let's grow
                    together!
                </p>
            </div>

            <div className="flex flex-wrap items-start justify-center gap-10 w-full">
                {contributorElements}
            </div>
        </div>
    );
}
