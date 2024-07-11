import React from "react";

const Features = () => {
    const features = [
        {
            id: 1,
            title: "Real-time data",
            content:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, expedita dolores? Eveniet omnis nemo obcaecati temporibus vitae pariatur reprehenderit at?",
        },
        {
            id: 2,
            title: "AI suggested notes",
            content:
                "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam quos consequuntur totam. Nisi modi minima hic, debitis perferendis molestias harum!",
        },
        {
            id: 3,
            title: "Up to date news articles",
            content:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, optio impedit pariatur placeat iure tempore nisi! Quisquam possimus commodi aperiam?",
        },
    ];
    return (
        <dl className="flex flex-col justify-between sm:flex-row gap-x-12 gap-y-8">
            {features.map((feature) => (
                <div key={feature.id} className="flex-1">
                    <dt className="text-2xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                    </dt>
                    <dd className="text-gray-600 leading-7">
                        {feature.content}
                    </dd>
                </div>
            ))}
        </dl>
    );
};

export default Features;
