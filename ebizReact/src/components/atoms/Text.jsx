import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import { SimpleButton } from ".";

const Text = ({ children, className, isShowMoreButton, showTooltip = true }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [isOverflow, setOverflow] = useState(null);
  const [title, setTitle] = useState(children);
  const textRef = useRef(null);

  useEffect(() => {
    if (isShowMoreButton) {
      const checkTextOverflow = () => {
        if (textRef.current?.getBoundingClientRect()) {
          const { height } = textRef.current.getBoundingClientRect() ?? {};
          setOverflow(height > 100);
          return height > 100;
        }
        return false;
      };

      if (checkTextOverflow()) {
        setShowFullText(false);
        setOverflow(true);
      } else {
        setShowFullText(true);
        setOverflow(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, isShowMoreButton, textRef?.current]);

  useEffect(() => {
    if (textRef?.current || children) {
      const splited = children?.split(/<\/?[^>]+>/)?.filter(Boolean);
      setTitle(splited?.join("\n")?.replace(/&nbsp;/g, " "));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textRef?.current, children]);

  const toggleShowFullText = () => {
    setShowFullText((s) => !s);
  };

  // Render based on whether the text contains HTML
  const renderContent = () => {
    if (!isShowMoreButton) {
      return <div dangerouslySetInnerHTML={{ __html: children }} />;
    } else {
      if (showFullText) {
        return (
          <div ref={textRef}>
            <div dangerouslySetInnerHTML={{ __html: children }} />
            {isOverflow && (
              <SimpleButton
                onClick={toggleShowFullText}
                link
                className="px-0 focus:shadow-none eb-link"
              >
                Show less
              </SimpleButton>
            )}
          </div>
        );
      } else {
        // If text contains HTML, dangerously set inner HTML (be cautious about XSS)
        return (
          <div ref={textRef}>
            <div
              dangerouslySetInnerHTML={{ __html: children }}
              className={`${!showFullText && "eb-overflow--5"}`}
            />
            {isOverflow && (
              <SimpleButton
                onClick={toggleShowFullText}
                link
                className="px-0 focus:shadow-none eb-link"
              >
                Show more
              </SimpleButton>
            )}
          </div>
        );
      }
    }
  };

  return (
    <div id="text-load-more" className={className} title={showTooltip && title}>
      {renderContent()}
    </div>
  );
};

Text.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isShowMoreButton: PropTypes.bool,
  showTooltip: PropTypes.bool
};

export default Text;
