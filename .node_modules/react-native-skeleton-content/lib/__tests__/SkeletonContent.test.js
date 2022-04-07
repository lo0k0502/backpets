"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_1 = __importDefault(require("react"));
const react_native_reanimated_1 = __importDefault(require("react-native-reanimated"));
const expo_linear_gradient_1 = require("expo-linear-gradient");
const react_test_renderer_1 = require("react-test-renderer");
const SkeletonContent_1 = __importDefault(require("../SkeletonContent"));
const Constants_1 = require("../Constants");
const staticStyles = {
    borderRadius: Constants_1.DEFAULT_BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: Constants_1.DEFAULT_BONE_COLOR
};
describe('SkeletonComponent test suite', () => {
    it('should render empty alone', () => {
        const tree = (0, react_test_renderer_1.create)(<SkeletonContent_1.default isLoading={false}/>).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('should have the correct layout when loading', () => {
        const layout = [
            {
                width: 240,
                height: 100,
                marginBottom: 10
            },
            {
                width: 180,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'grey'
            }
        ];
        const props = {
            layout,
            isLoading: true,
            animationType: 'none'
        };
        const instance = (0, react_test_renderer_1.create)(<SkeletonContent_1.default {...props}/>);
        const component = instance.root;
        const bones = component.findAllByType(react_native_reanimated_1.default.View);
        // two bones and parent component
        expect(bones.length).toEqual(layout.length + 1);
        expect(bones[0].props.style).toEqual({
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center'
        });
        // default props that are not set
        expect(bones[1].props.style).toEqual([Object.assign(Object.assign({}, layout[0]), staticStyles)]);
        expect(bones[2].props.style).toEqual([
            Object.assign({ overflow: 'hidden' }, layout[1])
        ]);
        expect(instance.toJSON()).toMatchSnapshot();
    });
    it('should render the correct bones for children', () => {
        const props = {
            isLoading: true,
            animationType: 'shiver'
        };
        const w1 = { height: 100, width: 200 };
        const w2 = { height: 120, width: 20 };
        const w3 = { height: 80, width: 240 };
        const children = [w1, w2, w3];
        const TestComponent = ({ isLoading, animationType }) => (<SkeletonContent_1.default isLoading={isLoading} animationType={animationType}>
        {children.map(c => (<react_native_1.View key={c.height} style={c}/>))}
      </SkeletonContent_1.default>);
        const instance = (0, react_test_renderer_1.create)(<TestComponent {...props}/>);
        let component = instance.root;
        // finding children count
        let bones = component.findAllByType(expo_linear_gradient_1.LinearGradient);
        expect(bones.length).toEqual(children.length);
        // finding styles of wrapper views
        bones = component.findAllByType(react_native_reanimated_1.default.View);
        expect(bones[1].props.style).toEqual(Object.assign(Object.assign({}, staticStyles), w1));
        expect(bones[3].props.style).toEqual(Object.assign(Object.assign({}, staticStyles), w2));
        expect(bones[5].props.style).toEqual(Object.assign(Object.assign({}, staticStyles), w3));
        // re-update with pulse animation
        instance.update(<TestComponent isLoading animationType="pulse"/>);
        component = instance.root;
        bones = component.findAllByType(react_native_reanimated_1.default.View);
        // cannot test interpolated background color
        expect(bones[1].props.style).toEqual([
            Object.assign(Object.assign({}, w1), { borderRadius: Constants_1.DEFAULT_BORDER_RADIUS }),
            { backgroundColor: { ' __value': 4278190080 } }
        ]);
        expect(bones[2].props.style).toEqual([
            Object.assign(Object.assign({}, w2), { borderRadius: Constants_1.DEFAULT_BORDER_RADIUS }),
            { backgroundColor: { ' __value': 4278190080 } }
        ]);
        expect(bones[3].props.style).toEqual([
            Object.assign(Object.assign({}, w3), { borderRadius: Constants_1.DEFAULT_BORDER_RADIUS }),
            { backgroundColor: { ' __value': 4278190080 } }
        ]);
        expect(instance.toJSON()).toMatchSnapshot();
    });
    it('should have correct props and layout between loading states', () => {
        const w1 = { width: 240, height: 100, marginBottom: 10 };
        const w2 = { width: 180, height: 40 };
        const layout = [w1, w2];
        const props = {
            layout,
            isLoading: true,
            animationType: 'shiver'
        };
        const childStyle = { fontSize: 24 };
        const instance = (0, react_test_renderer_1.create)(<SkeletonContent_1.default {...props}>
        <react_native_1.Text style={childStyle}/>
      </SkeletonContent_1.default>);
        const component = instance.root;
        let bones = component.findAllByType(expo_linear_gradient_1.LinearGradient);
        // one animated view child for each bone + parent
        expect(bones.length).toEqual(layout.length);
        bones = component.findAllByType(react_native_reanimated_1.default.View);
        expect(bones[1].props.style).toEqual(Object.assign(Object.assign({}, staticStyles), w1));
        expect(bones[3].props.style).toEqual(Object.assign(Object.assign({}, staticStyles), w2));
        let children = component.findAllByType(react_native_1.Text);
        // no child since it's loading
        expect(children.length).toEqual(0);
        // update props
        instance.update(<SkeletonContent_1.default {...props} isLoading={false}>
        <react_native_1.Text style={childStyle}/>
      </SkeletonContent_1.default>);
        bones = instance.root.findAllByType(expo_linear_gradient_1.LinearGradient);
        expect(bones.length).toEqual(0);
        children = instance.root.findAllByType(react_native_1.Text);
        expect(children.length).toEqual(1);
        expect(children[0].props.style).toEqual(childStyle);
        // re-update to loading state
        instance.update(<SkeletonContent_1.default {...props}>
        <react_native_1.Text style={childStyle}/>
      </SkeletonContent_1.default>);
        bones = instance.root.findAllByType(expo_linear_gradient_1.LinearGradient);
        expect(bones.length).toEqual(layout.length);
        bones = component.findAllByType(react_native_reanimated_1.default.View);
        expect(bones[1].props.style).toEqual(Object.assign(Object.assign({}, staticStyles), w1));
        expect(bones[3].props.style).toEqual(Object.assign(Object.assign({}, staticStyles), w2));
        children = instance.root.findAllByType(react_native_1.Text);
        // no child since it's loading
        expect(children.length).toEqual(0);
        // snapshot
        expect(instance.toJSON()).toMatchSnapshot();
    });
    it('should support nested layouts', () => {
        const layout = [
            {
                flexDirection: 'row',
                width: 320,
                height: 300,
                children: [
                    {
                        width: 200,
                        height: 120
                    },
                    {
                        width: 180,
                        height: 100
                    }
                ]
            },
            {
                width: 180,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'grey'
            }
        ];
        const props = {
            layout,
            isLoading: true,
            animationType: 'shiver'
        };
        const instance = (0, react_test_renderer_1.create)(<SkeletonContent_1.default {...props}/>);
        const component = instance.root;
        let bones = component.findAllByType(expo_linear_gradient_1.LinearGradient);
        // three overall bones
        expect(bones.length).toEqual(3);
        bones = component.findAllByType(react_native_reanimated_1.default.View);
        expect(bones[1].props.style).toEqual({
            flexDirection: 'row',
            width: 320,
            height: 300
        });
        // testing that styles for nested layout and last child persist
        expect(bones[2].props.style).toEqual(Object.assign(Object.assign({}, staticStyles), layout[0].children[0]));
        expect(bones[4].props.style).toEqual(Object.assign(Object.assign({}, staticStyles), layout[0].children[1]));
        expect(bones[6].props.style).toEqual(Object.assign(Object.assign({}, staticStyles), layout[1]));
        expect(instance.toJSON()).toMatchSnapshot();
    });
    it('should support percentage for child size', () => {
        const parentHeight = 300;
        const parentWidth = 320;
        const containerStyle = {
            width: parentWidth,
            height: parentHeight
        };
        const layout = [
            {
                width: '20%',
                height: '50%',
                borderRadius: 20,
                backgroundColor: 'grey'
            },
            {
                width: '50%',
                height: '10%',
                borderRadius: 10
            }
        ];
        const props = {
            layout,
            isLoading: true,
            animationType: 'shiver',
            containerStyle
        };
        const instance = (0, react_test_renderer_1.create)(<SkeletonContent_1.default {...props}/>);
        const component = instance.root;
        let bones = component.findAllByType(expo_linear_gradient_1.LinearGradient);
        expect(bones.length).toEqual(layout.length);
        // get parent
        bones = component.findAllByType(react_native_reanimated_1.default.View);
        // testing that styles of childs corresponds to percentages
        expect(bones[1].props.style).toEqual(Object.assign(Object.assign({}, staticStyles), layout[0]));
        expect(bones[3].props.style).toEqual(Object.assign(Object.assign({}, staticStyles), layout[1]));
        expect(instance.toJSON()).toMatchSnapshot();
    });
    it('should have the correct gradient properties', () => {
        let customProps = {
            layout: [
                {
                    width: 240,
                    height: 100,
                    marginBottom: 10
                }
            ],
            isLoading: true,
            animationDirection: 'diagonalDownLeft'
        };
        const TestComponent = (props) => (<SkeletonContent_1.default {...props}>
        <react_native_reanimated_1.default.View style={{ height: 100, width: 200 }}/>
      </SkeletonContent_1.default>);
        const component = (0, react_test_renderer_1.create)(<TestComponent {...customProps}/>);
        let gradient = component.root.findByType(expo_linear_gradient_1.LinearGradient);
        expect(gradient).toBeDefined();
        expect(gradient.props.start).toEqual({ x: 0, y: 0 });
        expect(gradient.props.end).toEqual({ x: 0, y: 1 });
        // change layout on diagonal component
        customProps = Object.assign(Object.assign({}, customProps), { layout: [
                {
                    width: 240,
                    height: 300
                }
            ] });
        component.update(<SkeletonContent_1.default {...customProps} animationDirection="diagonalDownLeft">
        <react_native_reanimated_1.default.View style={{ height: 300, width: 200 }}/>
      </SkeletonContent_1.default>);
        gradient = component.root.findByType(expo_linear_gradient_1.LinearGradient);
        expect(gradient).toBeDefined();
        expect(gradient.props.start).toEqual({ x: 0, y: 0 });
        expect(gradient.props.end).toEqual({ x: 1, y: 0 });
        component.update(<SkeletonContent_1.default {...customProps} animationDirection="verticalTop">
        <react_native_1.Text style={{ fontSize: 24 }}/>
      </SkeletonContent_1.default>);
        gradient = component.root.findByType(expo_linear_gradient_1.LinearGradient);
        expect(gradient).toBeDefined();
        expect(gradient.props.start).toEqual({ x: 0, y: 0 });
        expect(gradient.props.end).toEqual({ x: 0, y: 1 });
        component.update(<SkeletonContent_1.default {...customProps} animationDirection="verticalDown">
        <react_native_1.Text style={{ fontSize: 24 }}/>
      </SkeletonContent_1.default>);
        gradient = component.root.findByType(expo_linear_gradient_1.LinearGradient);
        expect(gradient).toBeDefined();
        expect(gradient.props.start).toEqual({ x: 0, y: 0 });
        expect(gradient.props.end).toEqual({ x: 0, y: 1 });
        component.update(<SkeletonContent_1.default {...customProps} animationDirection="horizontalLeft">
        <react_native_1.Text style={{ fontSize: 24 }}/>
      </SkeletonContent_1.default>);
        gradient = component.root.findByType(expo_linear_gradient_1.LinearGradient);
        expect(gradient).toBeDefined();
        expect(gradient.props.start).toEqual({ x: 0, y: 0 });
        expect(gradient.props.end).toEqual({ x: 1, y: 0 });
        component.update(<SkeletonContent_1.default {...customProps} animationDirection="horizontalRight">
        <react_native_1.Text style={{ fontSize: 24 }}/>
      </SkeletonContent_1.default>);
        gradient = component.root.findByType(expo_linear_gradient_1.LinearGradient);
        expect(gradient).toBeDefined();
        expect(gradient.props.start).toEqual({ x: 0, y: 0 });
        expect(gradient.props.end).toEqual({ x: 1, y: 0 });
        expect(gradient.props.colors).toEqual([
            Constants_1.DEFAULT_BONE_COLOR,
            Constants_1.DEFAULT_HIGHLIGHT_COLOR,
            Constants_1.DEFAULT_BONE_COLOR
        ]);
    });
});
