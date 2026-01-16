import React, { useEffect, useRef } from 'react';

interface PreviewFrameProps {
  htmlCode: string;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ htmlCode }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const enhancedHtml = htmlCode.replace('</body>', `
        <script>
            window.onerror = function(msg, url, lineNo, columnNo, error) {
                const div = document.createElement('div');
                div.style.position = 'fixed';
                div.style.top = '10px';
                div.style.left = '10px';
                div.style.background = '#fee2e2';
                div.style.color = '#991b1b';
                div.style.padding = '12px';
                div.style.borderRadius = '8px';
                div.style.zIndex = '9999';
                div.style.fontFamily = 'sans-serif';
                div.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                div.innerText = '⚠️ System Error: ' + msg;
                document.body.appendChild(div);
                return false;
            };
        </script>
        </body>
      `);
      
      iframeRef.current.srcdoc = enhancedHtml;
    }
  }, [htmlCode]);

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-inner border border-slate-200 overflow-hidden relative">
      <iframe
        ref={iframeRef}
        title="Simulation Preview"
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
      />
    </div>
  );
};

export default PreviewFrame;