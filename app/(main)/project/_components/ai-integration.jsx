'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Together from "together-ai";
 
const together = new Together({ apiKey: "tgp_v1_nND3jC0oQORR5m_warbr66yGqZXEG5Iba3kXu3pEfng"});
 
export default function TokenInputForm({ requirements, updateIssues, setIsLoading }) {
  const [token, setToken] = useState('');
  const [apiData, setApiData] = useState(null);
 
  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  function extractJSON(text) {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch (error) {
        console.error("Invalid JSON format:", error);
        return null;
      }
    }
    return null;
  }
 
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!token) {
      alert("Please enter a token");
      setIsLoading(false);
      return;
    }
 
    try {
    // YtGX4fvKrGWNuV5VgosaT9xU
      const response = await fetch(`https://api.susaf.se4gd.eu/api/v1/effects/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        setIsLoading(false);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const filteredData = filterData(data);
 
      const result = await generateCompletion(filteredData)
      console.log("result", result);

        const jsonString = result
        try {
            const jsonObject = extractJSON(jsonString); // Convert to JS object
            console.log(jsonObject);
            setApiData(jsonObject);
            console.log("updateIssues", updateIssues);
            updateIssues(jsonObject);
        } catch (error) {
            console.error("Invalid JSON format:", error);
        }
      setIsLoading(false);
     
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please check the token and try again.');
    }
  };
 
  const filterData = (data) => {
    return {
      project_name: data.project_name,
      project_description: data.project_description,
      effects: data.effects.map((effect) => ({
        name: effect.name,
        question: effect.question,
        effects: effect.effects.map((subEffect) => ({
          description: subEffect.description,
          is_positive: subEffect.is_positive,
          likelihood: subEffect.likelihood,
          impact_level: subEffect.impact_level,
          order_of_impact: subEffect.order_of_impact,
          dimension_name: subEffect.dimension_name,
        })),
      })),
    };
  };
 
  const generateCompletion = async (filteredData) => {
    const prompt = `
      Generate a sustainability-focused scrum-compliant product backlog items for the corresponding requirements  from the user with SusAF in mind. Each backlog item should focus on enhancing inclusive decision-making, diverse stakeholder engagement, and sustainability-driven planning while maintaining Agile best practices.
 
      The PBI contains the Title of the requirement, description in the form of user stories, the priority based on the impact, business value, and sustainability aspect, also include the dimensions  aspect as well as i.e. "Individual", "Technical", "Environmental", "Economic" and "Social" into PBI
 
      The backlog should reflect the SusAF and emphasize features that foster sustainability. Each backlog item should be paired with a clear user story written in the format:
 
      As a [role], I want to [action], so that [benefit].
 
      Ensure that each feature aligns with SuSAF’s principles of sustainability, inclusion, and impact. The final backlog should prioritize features based on immediate impact and feasibility while maintaining Agile methodologies.
 
 
      Give Me output in Json format:
      {
        backlog_title: "",
        backlog_description: "",
        priority: "",
        story_points: "",
        sustainability_points: "",
        acceptance_criteria: "", (String)
        sustainability_criteria: "", (String)
        sustainability_dimensions: "" (Array of dimensions)
      }
 
      Data (SusAF): ${JSON.stringify(filteredData)}
      Data (Requirements): ${JSON.stringify(requirements)}
    `;
 
    try {
      const res = await together.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          }
        ],
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        max_tokens: null,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["<|eot_id|>", "<|eom_id|>"],
        stream: true
      });
 
      let result = '';
      for await (const token of res) {
        result += token.choices[0]?.delta?.content || '';
      }
     
      return result;
 
    } catch (error) {
      console.error('Error generating completion:', error);
    }
  };
 
  return (
    <form onSubmit={handleSubmit}>

      <div className="flex justify-start gap-3">
          <Button type="submit" variant="default" size="lg" className="flex items-center gap-1 my-4">
            Generate Backlog
          </Button>
      </div>
      <div className="relative mb-5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
        <input
          type="text"
          name="token"
          id="token"
          value={token}
          onChange={handleTokenChange}
          className="w-full p-4 border-none bg-transparent focus:outline-none"
          placeholder="Enter your token from the SusAF Tool here"
        />
      </div>

      {apiData && (
        <textarea
          className="w-full p-2 border rounded"
          rows={5}
          readOnly
          value={JSON.stringify(apiData, null, 2)}
        />
      )}
  </form>
  );
}