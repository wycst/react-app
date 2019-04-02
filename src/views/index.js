import React from 'react';

export default class Index extends React.Component {
    render() {

        console.log(window.location.hash);

        return (
            <div>
                <a>回到home</a>
            </div>
        )
    }
}