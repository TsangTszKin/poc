import React, { Component } from 'react';
import Test1 from '@/components/Test';

// const treeJson = {
//     root: true,
//     type: 'and',
//     conditions: [
//         { title: 'AAA' },
//         { title: 'BBB' },
//         { title: 'CCC' },
//         {
//             title: 'DDD',
//             childNode: { root: false, type: 'or', conditions: [{ title: 'EEE' }, { title: 'FFF' }] }
//         }
//     ]
// }



class Test extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.data);
    }

    render() {
        return (
            <div>
                <p>{this.props.data.type === 'and' ? '满足全部' : '满足其中一条'}</p>
                {this.props.data.conditions.map((item, i) =>
                    <div>
                        <p>{item.title}</p>

                        {item.childNode ? <Test1 data={item.childNode}></Test1> : ''}

                    </div>

                )}
            </div>
        )
    }
}

export default Test;