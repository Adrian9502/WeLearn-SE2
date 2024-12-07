import React, { useState } from "react";
import PropTypes from "prop-types";
import { Copy } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
const CopyableID = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  };

  return (
    <div className="relative flex items-center gap-2">
      <span className="font-mono text-sm">{value}</span>
      <CopyToClipboard text={value} onCopy={handleCopy}>
        <button className="p-1.5 rounded-md hover:bg-slate-700 transition-colors">
          <Copy className="w-4 h-4 text-slate-400" />
        </button>
      </CopyToClipboard>
      {copied && (
        <div className="absolute -top-2 right-0 px-2 py-1 z-50 bg-slate-700 text-xs rounded-md">
          Copied!
        </div>
      )}
    </div>
  );
};

CopyableID.propTypes = {
  value: PropTypes.string.isRequired,
};

export default CopyableID;
