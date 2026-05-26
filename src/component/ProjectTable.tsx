import { useState } from "react";
import { data } from "../utils/data";
import { BsThreeDots } from "react-icons/bs";

const ProjectTable = () => {
  const [project, setProject] = useState(data);
  return (
    <div className="p-4 w-[93%] ml-20">
      <table className="min-w-full table-auto rounded border border-gray-700 text-white">
        <thead>
          <tr>
            <th className="px-5 py-3 text-left">Image</th>
            <th className="px-5 py-3 text-left">Name</th>
            <th className="px-5 py-3 text-left">Country</th>
            <th className="px-5 py-3 text-left">Email</th>
            <th className="px-5 py-3 text-left">Project Name</th>
            <th className="px-5 py-3 text-left">Task Progress</th>
            <th className="px-5 py-3 text-left">Status</th>
            <th className="px-5 py-3 text-left">Date</th>
            <th className="px-5 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white ">
          {project.map((project, index) => (
            <tr className="border border-gray-700">
              <td className="px-4 py-2">
                <img
                  src={project.image}
                  alt={project.client}
                  className="w-12 h-12 object-cover rounded-full"
                />
              </td>

              <td className="px-4 py-2">{project.client}</td>
              <td className="px-4 py-2">{project.country}</td>
              <td className="px-4 py-2">{project.email}</td>
              <td className="px-4 py-2">{project.project}</td>
              <td className="px py-2">
                <div className="w-24 h-2 bg-gray-700 rounded">
                    <div className="h-2 bg-green-500 rounded"></div>
                </div>
              </td>

              <td className="px-4 py-2 w-40">
                <span>{project.status}</span>
              </td>
              <td className="px-4 py-2">{project.date}</td>
                            <td className="px-4 py-2">
                                <div className="relative">
                                    <BsThreeDots className="cursor-pointer"/>
                                </div>
                            </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
