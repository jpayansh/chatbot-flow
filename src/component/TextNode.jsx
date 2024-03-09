import React from "react";
import { IoMdMail } from "react-icons/io";
import { Handle, Position } from "reactflow";

function TextNode({ selected, data }) {
  return (
    <div
      className={`w-40 shadow-md rounded-md bg-white ${
        selected ? "border-solid border-2 border-indigo-400" : ""
      }`}
    >
      <div className="flex flex-col">
        <div className="flex content-center max-h-max px-2 py-1 text-left text-black text-xs font-bold rounded-t-md bg-indigo-300">
          <IoMdMail className="text-[#f3f3f3] mr-1" />
          Send Message
        </div>
        <div className="px-3 py-2">
          <div className="text-xs font-normal text-black">
            {data?.label ?? "Text Node"}
          </div>
        </div>
      </div>
      <Handle
        id="a"
        type="target"
        position={Position.Left}
        className="w-1 rounded-full bg-slate-500"
      />
      <Handle
        id="b"
        type="source"
        position={Position.Right}
        className="w-1 rounded-full bg-gray-500"
      />
    </div>
  );
}

export default TextNode;
