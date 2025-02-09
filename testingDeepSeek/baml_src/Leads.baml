// Defining a data model.
class LeadInfo{
  companyName string
  industry string
  employeeCount int?
  budgetEstimate float
  country string
  companyNeeds string
  description string
  expectedScore float?
}

class LeadExamples{
  amazingLeads LeadInfo[]
  decentLeads LeadInfo[]
  terribleLeads LeadInfo[]
}
class Leads {
  lead_score float
}

// Create a function to extract the resume from a string.
function ScoreTheLead(lead_info: LeadInfo, lead_examples: LeadExamples) -> Leads {
  // Specify a client as provider/model-name
  // you can use custom LLM params with a custom client name from clients.baml like "client CustomHaiku"
  client "MyDeepseekV3" // Set OPENAI_API_KEY to use this client.
  prompt #"
    Use this content to generate a lead score for the lead info from 1 to 100 using floats.
    
    Company Name: {{ lead_info.companyName }}
    Industry {{ lead_info.industry }}
    Employee count {{ lead_info.employeeCount }}
    Budget Estimate {{ lead_info.budgetEstimate }}
    Country {{ lead_info.country }}
    Company Need {{ lead_info.companyNeeds }}
    Description {{ lead_info.description }}


    Depend on {{lead_examples}} to generate the lead scores.
    {{ ctx.output_format }}
  "#
}

test TestScoreTheLeadWithLowBudget {
  functions [ScoreTheLead]
  args {
    lead_info {
      companyName "Future Tech Solutions"
      industry "Technology"
      employeeCount 200
      budgetEstimate 2000000.0
      country "USA"
      companyNeeds "Expansion of AI research and development"
      description "A cutting-edge technology company specializing in artificial intelligence and machine learning solutions."
    }
    lead_examples {
      amazingLeads [
      {
      companyName "Tech Innovators"
      industry "Technology"
      employeeCount 500
      budgetEstimate 1000000.0
      country "USA"
      companyNeeds "Investment in R&D"
      description "A leading tech company focusing on innovative solutions."
      expectedScore 95.0
      },
      {
      companyName "Green Energy Co."
      industry "Renewable Energy"
      employeeCount 300
      budgetEstimate 500000.0
      country "Germany"
      companyNeeds "Expansion of solar panel production"
      description "A company dedicated to providing renewable energy solutions."
      expectedScore 90.0
      }
      ]
      decentLeads [
      {
      companyName "Local Grocers"
      industry "Retail"
      employeeCount 50
      budgetEstimate 10000.0
      country "Canada"
      companyNeeds "Supply chain optimization"
      description "A chain of local grocery stores."
      expectedScore 70.0
      },
      {
      companyName "EduTech"
      industry "Education"
      employeeCount 100
      budgetEstimate 20000.0
      country "UK"
      companyNeeds "Development of online learning platforms"
      description "An educational technology company."
      expectedScore 75.0
      }
      ]
      terribleLeads [
      {
      companyName "Old School Industries"
      industry "Manufacturing"
      employeeCount 20
      budgetEstimate 5000.0
      country "India"
      companyNeeds "Modernization of equipment"
      description "A small manufacturing company with outdated equipment."
      expectedScore 40.0
      },
      {
      companyName "Struggling Startups"
      industry "Various"
      employeeCount 5
      budgetEstimate 1000.0
      country "Brazil"
      companyNeeds "Initial funding"
      description "A group of startups struggling to get off the ground."
      expectedScore 30.0
      }
      ]
    }
    }
}
