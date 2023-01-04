from typing import List

from sentry.dynamic_sampling.rules.biases.base import (
    Bias,
    BiasData,
    BiasDataProvider,
    BiasParams,
    BiasRulesGenerator,
)
from sentry.dynamic_sampling.utils import RESERVED_IDS, BaseRule, RuleType


class BoostEnvironmentsDataProvider(BiasDataProvider):
    def get_bias_data(self, bias_params: BiasParams) -> BiasData:
        return {"id": RESERVED_IDS[RuleType.BOOST_ENVIRONMENTS_RULE]}


class BoostEnvironmentsRulesGenerator(BiasRulesGenerator):
    def _generate_bias_rules(self, bias_data: BiasData) -> List[BaseRule]:
        return [
            {
                "sampleRate": 1,
                "type": "trace",
                "condition": {
                    "op": "or",
                    "inner": [
                        {
                            "op": "glob",
                            "name": "trace.environment",
                            "value": ["*dev*", "*test*"],
                            "options": {"ignoreCase": True},
                        }
                    ],
                },
                "active": True,
                "id": bias_data["id"],
            }
        ]


BOOST_ENVIRONMENTS_BIAS = Bias(BoostEnvironmentsDataProvider, BoostEnvironmentsRulesGenerator)
