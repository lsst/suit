##########
Change log
##########

1.1.1 (2019-12-03)
==================

- Activated Firefly-release-pinning mechanism (NB: only on release branches of ``suit``).  Improved messaging when the LSP-local TAP service cannot be reliably inferred.
  [`DM-22455 <https://jira.lsst.org/browse/DM-22455>`_]

- Started automatically computing the TAP service URL from the base URL of the LSP instance, and ensured that this works correctly when Firefly is invoked within the Notebook Aspect (as a JupyterLab extension).
  [`DM-21846 <https://jira.lsst.org/browse/DM-21846>`_]
  [`DM-22331 <https://jira.lsst.org/browse/DM-22331>`_]

- **Uses Firefly release-2019.3.2.**  See the `Firefly release notes <https://github.com/Caltech-IPAC/firefly/blob/dev/docs/release-notes.md>`.  Key LSST-relevant features:

  - Build scripts support release-pinning in application packages.
    [`DM-20931 <https://jira.lsst.org/browse/DM-20931>`_]

  - TAP logic conforms to LSST requirements for including Authorization: headers when TAP result URLs are redirected.
    [`DM-21921 <https://jira.lsst.org/browse/DM-21921>`_]

- Known bugs:

  - A change in table handling in Firefly 2019.3.x inadvertently broke the LSST detection footprint visualization capability.  Will be fixed in the next major Firefly release.
