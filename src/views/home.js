import React from 'react';

export default class Home extends React.Component {
    render() {

        console.log(window.location.hash);

        return (
            <div>
                <a>detail</a>
            </div>
        )
    }
}