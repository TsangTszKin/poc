import * as React from 'react';

// React Component
/*
class Component<P, S> {
  constructor(props: Readonly<P>);
  setState<K extends keyof S>(
    state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
    callback?: () => void
  ): void;
  forceUpdate(callBack?: () => void): void;
  render(): ReactNode;
  readonly props: Readonly<{ children?: ReactNode }> & Readonly<P>;
  state: Readonly<S>;
  context: any;
  refs: {
    [key: string]: ReactInstance
  };
}
*/

class MyComponent extends React.Component<IMyComponentProps, IMyComponentState> {
    static defaultProps = {};

    readonly state = {};

    render() {
        return (
            <div>

            </div>
        );
    }
}

export default MyComponent;

interface IMyComponentProps {

}

interface IMyComponentState {

}

const style = {

};
