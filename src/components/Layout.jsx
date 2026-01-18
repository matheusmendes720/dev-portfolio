import CustomCursor from './CustomCursor';
import ThreeBackground from './ThreeBackground';

const Layout = ({ children }) => {
    return (
        <>
            <div className="scanlines"></div>
            <div className="blueprint-grid"></div>
            <ThreeBackground />
            <CustomCursor />
            <div className="container">
                {children}
            </div>
        </>
    );
};

export default Layout;
