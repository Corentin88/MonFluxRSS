"use client";
import { useState } from "react";
import ListeFlux from "@/components/ListesFlux/ListeFlux";

export default function Sources() {
    const [flux, setFlux] = useState({});
  
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full px-4">
          <h1 className="text-2xl font-bold mb-4">Les sources</h1>
          <p className="mb-4">Voici les sources de flux RSS que vous avez ajoutées.</p>
        </div>
  
        <ListeFlux onData={setFlux} />
  
        <div className="w-full px-4">
          {Object.keys(flux).length === 0 ? (
            <p className="text-center text-gray-500">Aucun flux trouvé</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(flux).map(([type, nomsFlux]) => (
                <div key={type} className="bg-orange-50 rounded-lg shadow p-4 w-full">
                  <h2 className="text-xl font-semibold mb-3 text-gray-800 text-center">{type}</h2>
                  <table className="w-full">
                    <tbody>
                      {nomsFlux.map((nom, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <div className="flex items-start">
                              <span className="inline-block w-6 text-right pr-2 text-gray-500">
                                {index + 1}.
                              </span>
                              <span className="flex-1">
                                {nom}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }