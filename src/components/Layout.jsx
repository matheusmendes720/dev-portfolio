import { useLocation } from 'react-router-dom';
import CustomCursor from './CustomCursor';
import ThreeBackground from './ThreeBackground';

const Layout = ({ children }) => {
    const location = useLocation();
    const isCleanPage = location.pathname.startsWith('/contest_calendar');

    return (
        <>
            {!isCleanPage && <div className="scanlines"></div>}
            {!isCleanPage && <div className="blueprint-grid"></div>}
            {!isCleanPage && <ThreeBackground />}
            <CustomCursor />

            {/* 
              If clean page (Calendar), use full width/height without .container constraint.
              Otherwise use standard container.
            */}
            {isCleanPage ? (
                <div className="w-full h-full min-h-screen">
                    {children}
                </div>
            ) : (
                <div className="container">
                    {children}
                </div>
            )}
        </>
    );
};

export default Layout;
