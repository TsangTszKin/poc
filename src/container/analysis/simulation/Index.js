import React, { Component } from 'react'
import PageHeader from '@/components/PageHeader'

class Simulation extends Component {
    render() {
        return (
            <div className='panel'>
                <PageHeader meta={this.props.meta}></PageHeader>
                <div className="pageContent">
                    Simulation
                </div>
            </div>
        )
    }
}

export default Simulation